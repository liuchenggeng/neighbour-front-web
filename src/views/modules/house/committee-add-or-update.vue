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
      <el-form-item label="业委会名称" prop="committeeName">
        <el-input v-model="dataForm.committeeName" placeholder="业委会名称"></el-input>
      </el-form-item>
      <el-form-item label="小区ID" prop="houseId">
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

        <!-- <el-input v-model="dataForm.houseId" placeholder="小区ID"></el-input> -->
      </el-form-item>
      <el-form-item label="业委会状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="请选择">
          <el-option
            v-for="item in optionStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- <el-input v-model="dataForm.status" placeholder="业委会状态"></el-input> -->
      </el-form-item>
      <el-form-item label="是否显示" prop="showStatus">
        <el-switch
          v-model="dataForm.showStatus"
          :active-value="1"
          :inactive-value="0"
          active-text="是"
          inactive-text="否"
        />
        <!-- <el-input v-model="dataForm.showStatus" placeholder="逻辑删除字段[0不显示，1显示]"></el-input> -->
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
      optionStatus: [
        { value: 0, label: "未成立" },
        { value: 1, label: "发起中" },
        { value: 2, label: "已成立" },
        { value: 3, label: "过期" }
      ],
      houseList: [],
      visible: false,
      loading: false,
      dataForm: {
        id: 0,
        committeeName: "",
        houseId: "",
        houseName: "",
        status: "",
        showStatus: 1,
        sort: ""
      },
      dataRule: {
        committeeName: [
          { required: true, message: "业委会名称不能为空", trigger: "blur" }
        ],
        houseId: [
          { required: true, message: "小区ID不能为空", trigger: "blur" }
        ],
        status: [
          {
            required: true,
            message: "业委会状态(0未成立,1发起中,2已成立,3过期)不能为空",
            trigger: "blur"
          }
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
              `/house/committee/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.houseList = [data.houseEntity];
              this.dataForm.committeeName = data.committee.committeeName;
              this.dataForm.houseId = data.committee.houseId;
              this.dataForm.status = data.committee.status;
              this.dataForm.showStatus = data.committee.showStatus;
              this.dataForm.sort = data.committee.sort;
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
              `/house/committee/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              committeeName: this.dataForm.committeeName,
              houseId: this.dataForm.houseId,
              status: this.dataForm.status,
              showStatus: this.dataForm.showStatus,
              sort: this.dataForm.sort,
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
              console.log("异常信息",data)
              const errorMap = data.data
              
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
