<template>
<v-form v-model="valid" ref="myBrandForm">
    <v-text v-model="brand.id" type="hidden"/>
    <v-text-field v-model="brand.productName" label="请输入品牌名称" required :rules="nameRules"/>
    <v-text v-model="brand.productId" type="hidden"/>
    <p style="font-size: 16px; color: #444">选择状态：<input type="radio" value="0" v-model="brand.recommendStatus">
                <label for="runoob">上线</label>&nbsp;&nbsp;&nbsp;
                <input type="radio" value="1" v-model="brand.recommendStatus">
                <label for="google">下线</label><br></p>
    <v-text-field v-model="brand.sort" label="序号"/>
    <v-layout class="my-4" row>
      <v-spacer/>
      <v-btn @click="submit" color="primary">提交</v-btn>
      <v-btn @click="clear">重置</v-btn>
    </v-layout>
  </v-form>
</template>
<script>
  import {post} from "../../common/js/http";

  export default {
    name: "newProduct-form",
    props: {
      oldBrand: {
        type: Object
      },
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        valid: false, // 表单校验结果标记
        brand: {
          id: '',// 广告ID
          productId: '', // 商品ID
          productName: '', // 商品名称
          recommendStatus: '',// 状态
          sort: 0, // 排序
        },
        // 品牌名称校验
        nameRules: [
          v => !!v || "商品名称不能为空",
          v => v.length > 1 || "商品名称至少2位"
        ],
      }
    },
    methods: {
      // 表单提交
      submit() {
        // 表单校验
        if (this.$refs.myBrandForm.validate()) {
          // 定义一个请求参数对象，通过解构表达式来获取brand中的属性
          const {...params} = this.brand;
          // 将数据提交到后台
          // this.$http.post('/item/brand', this.$qs.stringify(params))
          post("/shop/newProduct/addProduct",this.$qs.stringify(params))
         /* this.$http({
            method: this.isEdit ? 'put' : 'post', // 动态判断是POST还是PUT
            url: 'http://localhost:80/shop/newProduct/addProduct',
            data: this.$qs.stringify(params)
          })*/.then(() => {
            // 关闭窗口
            this.$emit("close");
            // 弹出提示
            this.$message.success("保存成功！");
          })
              .catch(() => {
                this.$message.error("保存失败！");
              });
        }
      },
      clear() {
        // 重置表单
        this.$refs.myBrandForm.reset();
        // 需要手动清空商品分类
        this.categories = [];
      }
    },
    watch: {
      oldBrand: { // 监控oldBrand的变化
        handler(val) {
          if (val) {
            // 注意不要直接复制，否则这边的修改会影响到父组件的数据，copy属性即可
            this.brand = Object.deepCopy(val)
          } else {
            // 为空，初始化brand
            this.brand = {
              name: '',
              letter: '',
              image: '',
              categories: [],
            }
          }
        },
        deep: true
      }
    }
  }
</script>

<style scoped>

</style>
