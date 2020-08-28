<template>
  <div>
    <el-cascader
      v-model="casValues"
      :props="props"
      :options="options"
      size="medium"
      @change="onchange"
      ref="regionCas"
    ></el-cascader>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import regions from "./regionCascader.js";

export default {
  name: "region-cascader",

  props: {
    casValues:  Array ,
    regionCas: {
      type: Function,
      required: true
    }
  },
  data() {
    //这里存放数据
    return {
      options: [],
      props: {
        label: "name",
        value: "id",
        children: "children"
      }
    };
  },

  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    onchange(values) {
      console.log("values", values);
      this.regionCas(values);
      //const selectNodes = this.$refs.regionCas.methods.getCheckedNodes
      console.log("选择的节点：",this.$refs.regionCas)
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    ///console.log("传递过来的值：", this.values);
    this.options = regions.getRegions();
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {
    console.log("传递过来的值：", this.casValues);
  }, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style >
.el-cascader-element {
  width: 80%;
}
</style>