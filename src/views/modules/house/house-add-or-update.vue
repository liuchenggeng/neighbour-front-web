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
      label-width="150px"
    >
      <el-form-item label="省份ID" prop="provinceId">
        <!-- <el-cascader v-model="casValues"  :options="options" :props="props"></el-cascader> -->
        <!-- <region-cascader @regionCas="regionCas" /> -->
        <region-cascader :regionCas="regionCas" :casValues="dataForm.casValues" />
      </el-form-item>

      <el-form-item label="名称" prop="houseName">
        <el-input v-model="dataForm.houseName" placeholder="小区名称"></el-input>
      </el-form-item>
      <el-form-item label="开发商" prop="houseBuilder">
        <el-input v-model="dataForm.houseBuilder" placeholder="小区开发商"></el-input>
      </el-form-item>
      <el-form-item label="修建日期" prop="houseBuildTime">
        <el-date-picker v-model="dataForm.houseBuildTime" type="date" placeholder="小区修建日期"></el-date-picker>
        <!-- <el-input v-model="dataForm.houseBuildTime" placeholder="小区修建时间"></el-input> -->
      </el-form-item>
      <el-form-item label="简介" prop="houseBrief">
        <el-input v-model="dataForm.houseBrief" placeholder="小区简介"></el-input>
      </el-form-item>
      <el-form-item label="详情" prop="houseDetail">
        <el-input
          v-model="dataForm.houseDetail"
          placeholder="小区详情"
          type="textarea"
          maxlength="300"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="housePrice">
        <el-input v-model="dataForm.housePrice" placeholder="小区价格"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="houseImgView">
        <single-upload v-model="dataForm.houseImgView"></single-upload>
        <!-- <el-input v-model="dataForm.houseImgView" placeholder="小区图片"></el-input> -->
      </el-form-item>
      <el-form-item label="物业公司" prop="propertyId">
        <el-input v-model="dataForm.propertyId" placeholder="物业公司ID"></el-input>
      </el-form-item>
      <el-form-item label="物业费" prop="propertyPrice">
        <el-input v-model="dataForm.propertyPrice" placeholder="物业费价格"></el-input>
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
import RegionCascader from "@/components/regionCascader/regionCascader.vue";
// import SingleUpload from "@/components/upload/singleUpload.vue";
export default {
  components: { RegionCascader },
  data() {
    return {
      visible: false,
      dataForm: {
        id: null,
        casValues: [],
        provinceId: 0,
        cityId: 0,
        countyId: 0,
        streetId: 0,
        houseName: "",
        houseBuilder: "",
        houseBuildTime: "",
        houseBrief: "",
        houseDetail: "",
        housePrice: "",
        houseImgView: "",
        propertyId: "",
        propertyPrice: "",
        showStatus: 1,
        sort: "",
        createName: "",
        createBy: "",
        createTime: "",
        updateName: "",
        updateBy: "",
        updateTime: ""
      },
      dataRule: {
        provinceId: [
          { required: true, message: "省份信息不能为空", trigger: "blur" }
        ],
        houseName: [
          { required: true, message: "小区名称不能为空", trigger: "blur" }
        ],
        houseBuilder: [
          { required: true, message: "小区开发商不能为空", trigger: "blur" }
        ],
        houseBuildTime: [
          { required: true, message: "小区修建时间不能为空", trigger: "blur" }
        ],
        houseBrief: [
          { required: true, message: "小区简介不能为空", trigger: "blur" }
        ],
        houseDetail: [
          { required: true, message: "小区详情不能为空", trigger: "blur" }
        ],
        housePrice: [
          { required: true, message: "小区价格不能为空", trigger: "blur" }
        ],
        houseImgView: [
          { required: true, message: "小区图片预览不能为空", trigger: "blur" }
        ],
        propertyId: [
          { required: true, message: "物业公司ID不能为空", trigger: "blur" }
        ],
        propertyPrice: [
          { required: true, message: "物业费价格不能为空", trigger: "blur" }
        ],

        sort: [{ required: true, message: "排序字段不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    //子组件向父组件传值
    regionCas(values) {
      console.log("添加组件获取到的区域：", values);
      this.dataForm.casValues = values;
      if (values.length > 1) {
        this.dataForm.provinceId = values[0];
        this.dataForm.cityId = values[1];
        this.dataForm.countyId = values[2];
        this.dataForm.streetId = values[3];
      } else {
        this.dataForm.provinceId = values[0];
        this.dataForm.cityId = 0;
        this.dataForm.countyId = 0;
        this.dataForm.streetId = 0;
      }
    },
    init(id) {
      this.dataForm.id = id || null;
      this.visible = true;
      this.dataForm.casValues = [];
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/house/house/info/${this.dataForm.id}`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.casValues = [
                data.house.provinceId,
                data.house.cityId,
                data.house.countyId,
                data.house.streetId
              ];
              console.log("从数据库查询到values:", this.dataForm.casValues);

              this.dataForm.provinceId = data.house.provinceId;
              this.dataForm.cityId = data.house.cityId;
              this.dataForm.countyId = data.house.countyId;
              this.dataForm.streetId = data.house.streetId;
              this.dataForm.houseName = data.house.houseName;
              this.dataForm.houseBuilder = data.house.houseBuilder;
              this.dataForm.houseBuildTime = data.house.houseBuildTime;
              this.dataForm.houseBrief = data.house.houseBrief;
              this.dataForm.houseDetail = data.house.houseDetail;
              this.dataForm.housePrice = data.house.housePrice;
              this.dataForm.houseImgView = data.house.houseImgView;
              this.dataForm.propertyId = data.house.propertyId;
              this.dataForm.propertyPrice = data.house.propertyPrice;
              this.dataForm.showStatus = data.house.showStatus;
              this.dataForm.sort = data.house.sort;
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
              `/house/house/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              provinceId: this.dataForm.provinceId,
              cityId: this.dataForm.cityId,
              streetId: this.dataForm.streetId,
              countyId: this.dataForm.countyId,
              houseName: this.dataForm.houseName,
              houseBuilder: this.dataForm.houseBuilder,
              houseBuildTime: this.dataForm.houseBuildTime,
              houseBrief: this.dataForm.houseBrief,
              houseDetail: this.dataForm.houseDetail,
              housePrice: this.dataForm.housePrice,
              houseImgView: this.dataForm.houseImgView,
              propertyId: this.dataForm.propertyId,
              propertyPrice: this.dataForm.propertyPrice,
              showStatus: this.dataForm.showStatus,
              sort: this.dataForm.sort
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
          }).catch(err=>{
            console.log(err)
          });
        }
      });
    }
  }
};
</script>
