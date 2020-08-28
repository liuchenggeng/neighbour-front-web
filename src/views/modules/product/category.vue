<!--  -->
<template>
  <div>
    <el-switch v-model="draggable" active-text="开启拖拽" inactive-text="关闭拖拽"></el-switch>
    <el-button v-if="draggable" size="small" @click="submitUpdateData">批量保存</el-button>
    <el-button size="small" @click="submitDeleteData">批量删除</el-button>
    <el-tree
      :data="menus"
      :props="defaultProps"
      :expand-on-click-node="false"
      show-checkbox
      node-key="catId"
      :default-expanded-keys="expandKeys"
      :draggable="draggable"
      :allow-drop="allowDrop"
      @node-drop="handleDrop"
      ref="categoryTree"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level <=2"
            type="text"
            size="mini"
            @click="() => append(data)"
          >Append</el-button>

          <el-button type="text" size="mini" @click="() => edit(data)">Edit</el-button>

          <el-button
            v-if="node.childNodes.length == 0"
            type="text"
            size="mini"
            @click="() => remove(node, data)"
          >Delete</el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog :title="title" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <el-form :model="category" label-width="20%">
        <el-form-item label="分类名称">
          <el-input v-model="category.name"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="category.icon"></el-input>
        </el-form-item>
        <el-form-item label="计量单位">
          <el-input v-model="category.productUnit"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      pCid: [],
      draggable: false,
      updateNodes: [],
      maxLevel: 0,
      dialogVisible: false,
      title: "",
      dialogType: "", //edit， add
      category: {
        name: "",
        parentCid: 0,
        catLevel: 0,
        showStatus: 1,
        sort: 0,
        catId: null,
        icon: "",
        productUnit: ""
      },
      menus: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      expandKeys: []
    };
  },
  methods: {
    submitDeleteData() {
      let checkedNodes = this.$refs.categoryTree.getCheckedNodes();
      let catIds = checkedNodes.map(item => item.catId);

      let catPids = checkedNodes.map(item => item.parentCid==undefined? 0:item.parentCid)

      console.log("被选中的结点：", checkedNodes);
      //如果選擇了數據
      if (checkedNodes != null && checkedNodes.length > 0) {
        this.$confirm(`确定对"${catIds}"进行[批量删除]操作?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$http({
              url: this.$http.adornUrl("/product/category/delete"),
              method: "post",
              data: this.$http.adornData(catIds, false)
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.getMenus();
                    this.expandKeys = catPids;
                  }
                });
              } else {
                this.$message.error(data.msg);
              }
            });
          })
          .catch(() => {});
      }
    },

    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {
          this.dialogVisible = false;
        });
    },
    //判断是否可以放置
    allowDrop(draggingNode, dropNode, type) {
      console.log("allowDrop:", draggingNode, dropNode, type);
      this.countNodeLevel(draggingNode);
      console.log("最大深度：", this.maxLevel);
      //获取到拖动项的最大深度
      let deep = Math.abs(this.maxLevel - draggingNode.level) + 1;
      if (type == "inner") {
        return deep + dropNode.level <= 3;
      } else {
        return deep + dropNode.parent.level <= 3;
      }
    },

    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log("tree drop: ", draggingNode, dropNode, dropType);
      let pCid = 0;
      let slibings = null;
      if (dropType == "before" || dropType == "after") {
        pCid =
          dropNode.parent.data.catId == undefined
            ? 0
            : dropNode.parent.data.catId;
        slibings = dropNode.parent.childNodes;
      } else {
        pCid = dropNode.data.catId;
        slibings = dropNode.childNodes;
      }

      this.pCid.push(pCid);

      for (let i = 0; i < slibings.length; i++) {
        //如果遍历的是当前拖放的结点，需要更新它的父结点id和级别以及它的子结点的级别

        if (slibings[i].data.catId == draggingNode.data.catId) {
          let catLevel = draggingNode.level;
          //当前拖放结点层级发生了变化
          if (slibings[i].level !== draggingNode.level) {
            catLevel = slibings[i].level;
            this.updateChildNodeLevel(slibings[i]);
          }

          this.updateNodes.push({
            catId: slibings[i].data.catId,
            sort: i,
            parentCid: pCid,
            catLevel: catLevel
          });
        } else {
          this.updateNodes.push({ catId: slibings[i].data.catId, sort: i });
        }
      }

      console.log("整理好的更新结点数据：", this.updateNodes);
    },

    submitUpdateData() {
      //将数据发送到后台修改
      this.$http({
        url: this.$http.adornUrl("/product/category/batchUpdate"),
        method: "post",
        data: this.$http.adornData(this.updateNodes, false)
      }).then(({ data }) => {
        this.dialogVisible = false;
        if (data && data.code === 0) {
          this.$message({
            message: "移动成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.getMenus();
              this.updateNodes = [];
              this.maxLevel = 0;
              this.expandKeys = this.pCid;
              //this.pCid = 0
            }
          });
        } else {
          this.$message.error(data.msg);
          this.getMenus();
          this.updateNodes = [];
          this.maxLevel = 0;
          this.expandKeys = [this.pCid];
          this.pCid = 0;
        }
      });
    },

    updateChildNodeLevel(node) {
      for (let i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];
        this.updateNodes.push({
          catId: child.data.catId,
          catLevel: child.level
        });
        this.updateChildNodeLevel(child);
      }
    },
    //统计当前结点的总层数。
    countNodeLevel(node) {
      if (node.childNodes != null && node.childNodes.length > 0) {
        for (let i = 0; i < node.childNodes.length; i++) {
          if (node.childNodes[i].level > this.maxLevel) {
            this.maxLevel = node.childNodes[i].level;
          }
          this.countNodeLevel(node.childNodes[i]);
        }
      }
    },

    //添加类型数据
    addCategory() {
      console.log("提交的数据：", this.category);
      this.$http({
        url: this.$http.adornUrl("/product/category/save"),
        method: "post",
        data: this.$http.adornData(this.category, false)
      }).then(({ data }) => {
        this.dialogVisible = false;
        if (data && data.code === 0) {
          this.$message({
            message: "添加成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.getMenus();

              this.expandKeys = [this.category.parentCid];
            }
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //修改类型数据
    editCategory() {
      console.log("提交的数据：", this.category);
      this.$http({
        url: this.$http.adornUrl("/product/category/update"),
        method: "post",
        data: this.$http.adornData(this.category, false)
      }).then(({ data }) => {
        this.dialogVisible = false;
        if (data && data.code === 0) {
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.getMenus();
              this.expandKeys = [this.category.parentCid];
            }
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //提交数据
    submitForm() {
      if (this.dialogType == "add") {
        this.addCategory();
      }
      if (this.dialogType == "edit") {
        this.editCategory();
      }
    },

    edit(data) {
      console.log("点击需要修改的节点:", data);
      this.dialogVisible = true;
      this.category.parentCid = data.parentCid;
      this.category.catLevel = data.catLevel;
      this.category.name = data.name;
      this.category.catId = data.catId;
      this.category.icon = data.icon;
      this.category.showStatus = data.showStatus;
      this.category.productUnit = data.productUnit;
      this.dialogType = "edit";
      this.title = "修改类型";
    },
    handleNodeClick(data) {
      console.log(data);
    },
    handleNodeClick(data) {
      console.log(data);
    },
    getMenus() {
      this.$http({
        url: this.$http.adornUrl("/product/category/listTree"),
        method: "get"
      }).then(data => {
        // console.log("成功获取 到菜单数据：", data)
        this.menus = data.data.categorys;
      });
    },
    append(data) {
      this.dialogVisible = true;
      console.log("接收的參數：", data);
      this.category.parentCid = data.catId;
      this.category.catLevel = data.catLevel * 1 + 1;
      this.dialogType = "add";
      this.category.name = "";
      this.category.catId = null;
      this.category.icon = "";
      this.category.productUnit = "";
      this.category.showStatus = 1;
      this.title = "修改类型";
    },

    remove(node, data) {
      console.log("刪除接收的參數：", node, data);
      var ids = [data.catId];
      this.$confirm(
        `确定对[${data.name}]进行[${ids ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/product/category/delete"),
            method: "post",
            data: this.$http.adornData(ids, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getMenus();
                  this.expandKeys = [node.parent.data.catId];
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    }
  },

  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getMenus();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //生命周期 - 创建之前
  beforeCreate() {},
  //生命周期 - 挂载之前
  beforeMount() {},
  //生命周期 - 更新之前
  beforeUpdate() {},
  //生命周期 - 更新之后
  updated() {},
  //生命周期 - 销毁之前
  beforeDestroy() {},
  //生命周期 - 销毁完成
  destroyed() {},
  //如果页面有keep-alive缓存功能，这个函数会触发
  activated() {}
};
</script>
<style  scoped>
</style>