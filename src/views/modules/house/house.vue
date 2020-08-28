<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input
          v-model="dataForm.key"
          placeholder="输入小区名称，简称，详情或价格以及省市县区街道等"
          width="300px"
          clearable
          @clear="getDataList()"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('house:house:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button
          v-if="isAuth('house:house:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      stripe
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
      @expand-change="loadImage"
      ref="tabRef"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-row>
              <el-col :span="4">
                <div>
                  <el-form-item label="修建日期">
                    <span>{{ scope.row.houseBuildTime }}</span>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="小区名称：">
                    <span>{{ scope.row.provinceName }}</span>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <el-form-item label="市：">
                    <span>{{ scope.row.cityName }}</span>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <el-form-item label="区县：">
                    <span>{{ scope.row.countyName }}</span>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <el-form-item label="街道：">
                    <span>{{ scope.row.streetName }}</span>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="8"></el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="provinceName" header-align="center" sortable align="center" label="省份"></el-table-column>
      <el-table-column prop="cityName" header-align="center" sortable align="center" label="地区"></el-table-column>
      <el-table-column prop="countyName" header-align="center" sortable align="center" label="县区"></el-table-column>
      <el-table-column prop="streetName" header-align="center" sortable align="center" label="街道"></el-table-column>
      <el-table-column prop="houseName" header-align="center" align="center" label="名称"></el-table-column>

      <el-table-column prop="showStatus" header-align="center" align="center" label="是否显示">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.showStatus"
            :active-value="1"
            :inactive-value="0"
            active-text="是"
            inactive-text="否"
            @change="onChangeSwitch(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="addOrUpdateImageHandle(scope.row)">图片</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <add-or-update-image
      v-if="addOrUpdateImageVisible"
      ref="addOrUpdateImage"
      @refreshDataList="getDataList"
    ></add-or-update-image>
  </div>
</template>

<script>
import AddOrUpdate from "./house-add-or-update";
import AddOrUpdateImage from "./houseimg-add-or-update";
export default {
  data() {
    return {
      imageMap: new Map(),
      dataForm: {
        key: ""
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      addOrUpdateImageVisible: false
    };
  },
  components: {
    AddOrUpdate,
    AddOrUpdateImage
  },
  activated() {
    this.getDataList();
  },
  methods: {
    loadImage(row, expandedRows) {
      let node = [
        {
          type: "Identifier",
          name: "foo"
        },
        {
          type: "Identifier1",
          name: "foo1"
        }
        ,
        {
          type: "Identifier2",
          name: "foo2"
        }
      ];
      // expandedRows
    let type = node
    console.log("解构后的结果：", type)

    },
    addOrUpdateImageHandle(row) {
      this.addOrUpdateImageVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdateImage.init(row.id);
      });
    },
    onChangeSwitch(dataRow) {
      console.log("获取到的数据：", dataRow);
      this.$http({
        url: this.$http.adornUrl("/house/house/update"),
        method: "post",
        data: this.$http.adornData({
          id: dataRow.id,
          provinceId: dataRow.provinceId,
          cityId: dataRow.cityId,
          countyId: dataRow.countyId,
          streetId: dataRow.streetId,
          showStatus: dataRow.showStatus
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.getDataList();
            }
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/house/house/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(row) {
      var rows = row ? [row] : this.dataListSelections;
      var ids = rows.map(item => {
        return item.id;
      });

      var names = rows.map(item => {
        return item.houseName;
      });
      this.$confirm(
        `确定对[小区=${names.join(",")}]进行[${
          row ? "删除" : "批量删除"
        }]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/house/house/delete"),
            method: "post",
            data: this.$http.adornData(ids, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style >
.el-input {
  width: 460px;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>