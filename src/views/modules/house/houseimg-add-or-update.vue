<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="140px"
    >
      <el-form-item label="选择图片" prop="imageUrl">
        <!-- <el-input v-model="dataForm.imageUrl" placeholder></el-input> -->
        <multi-upload v-model="dataForm.imageUrl"></multi-upload>
      </el-form-item>
      <el-form-item label="是否显示" prop="showStatus">
        <!-- <el-input v-model="dataForm.showStatus" placeholder="是否显示"></el-input> -->
        <el-switch
          v-model="dataForm.showStatus"
          :active-value="1"
          :inactive-value="0"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
      <el-form-item label="排序字段" prop="sort">
        <el-input v-model="dataForm.sort" placeholder="排序字段"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: "",
        houseId: "",
        imageUrl: [],
        showStatus: 1,
        sort: ""
      },
      dataRule: {
        houseId: [{ required: true, message: "不能为空", trigger: "blur" }],
        imageUrl: [{ required: true, message: "不能为空", trigger: "blur" }],
        showStatus: [
          { required: true, message: "是否显示不能为空", trigger: "blur" }
        ],
        sort: [{ required: true, message: "排序字段不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    init(id) {
      this.dataForm.houseId = id;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/house/houseimg/listByHouseId/${this.dataForm.houseId}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            console.log("获取到所有的图片列表：", data);
            if (data && data.code === 0) {
              this.dataForm.imageUrl = data.houseImg.imageUrl;
              this.dataForm.showStatus = data.houseImg.showStatus;
              this.dataForm.sort = data.houseImg.sort;
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/house/houseimg/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              houseId: this.dataForm.houseId,
              imageUrl: this.dataForm.imageUrl,
              showStatus: this.dataForm.showStatus,
              sort: this.dataForm.sort,
              createName: this.dataForm.createName,
              createBy: this.dataForm.createBy,
              createTime: this.dataForm.createTime,
              updateName: this.dataForm.updateName,
              updateBy: this.dataForm.updateBy,
              updateTime: this.dataForm.updateTime
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
