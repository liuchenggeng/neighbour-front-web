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
      label-width="80px"
    >
      <el-form-item label="小区 ID" prop="houseId">
        <el-select
          v-model="dataForm.houseId"
          filterable
          remote
          placeholder="请输入小区名称关键词"
          :remote-method="remoteMethod"
          :loading="loading"
          clearable
          @change="onChange"
          @clear="onClear"
        >
          <el-option
            v-for="item in houseList"
            :key="item.id"
            :label="item.houseName"
            :value="item.id"
          >
            <span style="float: left">{{ item.houseName }}</span>
            <span
              style="float: right; color: #8492a6; font-size: 13px"
            >{{ item.provinceName }}/{{item.cityName}}/{{item.countyName}}/{{item.streetName}}</span>
          </el-option>
        </el-select>
        <!-- <el-input v-model="dataForm.houseId" placeholder="小区 ID"></el-input> -->
      </el-form-item>
      <el-form-item label="物业公司名称" prop="propertyName">
        <el-input v-model="dataForm.propertyName" placeholder="物业公司名称"></el-input>
      </el-form-item>
      <el-form-item label="物业公司图标" prop="propertyIcon">
        <single-upload v-model="dataForm.propertyIcon"></single-upload>
        <!-- <el-input v-model="dataForm.propertyIcon" placeholder="物业公司图标"></el-input> -->
      </el-form-item>
      <el-form-item label="物业公司说明" prop="propertyDesc">
        <el-input v-model="dataForm.propertyDesc" placeholder="物业公司说明"></el-input>
      </el-form-item>
      <el-form-item label="是否显示" prop="showStatus">
        <el-switch
          v-model="dataForm.showStatus"
          :active-value="1"
          :inactive-value="0"
          active-text="是"
          inactive-text="否"
        />

        <!-- <el-input v-model="dataForm.showStatus" placeholder="是否显示"></el-input> -->
      </el-form-item>
      <el-form-item label="排序字段" prop="sort">
        <el-input v-model="dataForm.sort" placeholder="排序字段"></el-input>
      </el-form-item>
      <el-form-item label="创建人名称" prop="createName">
        <el-input v-model="dataForm.createName" placeholder="创建人名称"></el-input>
      </el-form-item>
      <el-form-item label="创建人ID" prop="createBy">
        <el-input v-model="dataForm.createBy" placeholder="创建人ID"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
      </el-form-item>
      <el-form-item label="更新人名称" prop="updateName">
        <el-input v-model="dataForm.updateName" placeholder="更新人名称"></el-input>
      </el-form-item>
      <el-form-item label="更新人ID" prop="updateBy">
        <el-input v-model="dataForm.updateBy" placeholder="更新人ID"></el-input>
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime">
        <el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
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
      houseList: [],
      loading: false,
      visible: false,
      dataForm: {
        id: "",
        houseId: "",
        propertyName: "",
        propertyIcon: "",
        propertyDesc: "",
        showStatus: "",
        sort: "",
        createName: "",
        createBy: "",
        createTime: "",
        updateName: "",
        updateBy: "",
        updateTime: ""
      },
      dataRule: {
        houseId: [
          { required: true, message: "小区 ID不能为空", trigger: "blur" }
        ],
        propertyName: [
          { required: true, message: "物业公司名称不能为空", trigger: "blur" }
        ],
        propertyIcon: [
          { required: true, message: "物业公司图标不能为空", trigger: "blur" }
        ],
        propertyDesc: [
          { required: true, message: "物业公司说明不能为空", trigger: "blur" }
        ],
        showStatus: [
          {
            required: true,
            message: "逻辑删除字段[0不显示，1显示]不能为空",
            trigger: "blur"
          }
        ],
        sort: [
          { required: true, message: "排序字段不能为空", trigger: "blur" }
        ],
        createName: [
          { required: true, message: "创建人名称不能为空", trigger: "blur" }
        ],
        createBy: [
          { required: true, message: "创建人ID不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateName: [
          { required: true, message: "更新人名称不能为空", trigger: "blur" }
        ],
        updateBy: [
          { required: true, message: "更新人ID不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    onChange(valueSelect) {
      console.log("选择的数据：", valueSelect);
    },
    onClear() {
      this.dataForm.houseId = "";
      this.dataForm.houseName = "";
    },
    getHouseList(query) {
      if (query !== "") {
        this.loading = true;
        this.$http({
          url: this.$http.adornUrl("/house/house/listSelect"),
          method: "get",
          params: this.$http.adornParams({
            key: query
          })
        }).then(({ data }) => {
          this.loading = false;
          if (data && data.code === 0) {
            console.log("select 小区：", data);
            this.houseList = data.data;
          } else {
            this.houseList = [];
          }
        });
      }
    },
    remoteMethod(query) {
      this.getHouseList(query);
    },
    init(id) {
      this.dataForm.id = id || null;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/house/houseproperty/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.houseId = data.houseProperty.houseId;
              this.dataForm.propertyName = data.houseProperty.propertyName;
              this.dataForm.propertyIcon = data.houseProperty.propertyIcon;
              this.dataForm.propertyDesc = data.houseProperty.propertyDesc;
              this.dataForm.showStatus = data.houseProperty.showStatus;
              this.dataForm.sort = data.houseProperty.sort;
              this.dataForm.createName = data.houseProperty.createName;
              this.dataForm.createBy = data.houseProperty.createBy;
              this.dataForm.createTime = data.houseProperty.createTime;
              this.dataForm.updateName = data.houseProperty.updateName;
              this.dataForm.updateBy = data.houseProperty.updateBy;
              this.dataForm.updateTime = data.houseProperty.updateTime;
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
              `/house/houseproperty/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              houseId: this.dataForm.houseId,
              propertyName: this.dataForm.propertyName,
              propertyIcon: this.dataForm.propertyIcon,
              propertyDesc: this.dataForm.propertyDesc,
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
