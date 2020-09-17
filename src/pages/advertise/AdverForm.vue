<template>
<v-form v-model="valid" ref="myAdverForm">
    <v-text v-model="brand.id" type="hidden"/>
    <v-text-field v-model="brand.name" label="请输入轮播名称" required :rules="nameRules"/>
    <p style="font-size: 16px; color: #444">选择轮播类型：<input type="radio" value="0" v-model="brand.type">
                <label for="runoob">移动端</label>&nbsp;&nbsp;&nbsp;
                <input type="radio" value="1" v-model="brand.type">
                <label for="google">PC端</label><br></p>
    <!--开始时间选择器-->
    <v-row>
    <v-col cols="12" sm="6" md="4">
      <v-menu
        ref="menu"
        v-model="startTime"
        :close-on-content-click="false"
        :return-value.sync="startTime"
        transition="scale-transition"
        offset-y
        min-width="50px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="brand.startTime"
            label="开始时间"
            prepend-icon="event"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="brand.startTime" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.menu.save(startTime)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
    <v-spacer></v-spacer></v-row>
    <!--开始时间选择结束-->
    
<!--结束时间选择器-->
    <v-row>
    <v-col cols="12" sm="6" md="4">
      <v-menu
        ref="menu"
        v-model="endTime"
        :close-on-content-click="false"
        :return-value.sync="endTime"
        transition="scale-transition"
        offset-y
        min-width="50px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="brand.endTime"
            label="结束时间"
            prepend-icon="event"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="brand.endTime" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.menu.save(endTime)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
    <v-spacer></v-spacer></v-row>
    <!--结束时间选择结束-->
    <p style="font-size: 16px; color: #444">状态：<input type="radio" value="0" v-model="brand.status">
                <label for="runoob">下线</label>&nbsp;&nbsp;&nbsp;
                <input type="radio" value="1" v-model="brand.status">
                <label for="google">上线</label><br></p>
    <v-text-field v-model="brand.clickCount" label="点击量"/>
    <v-text-field v-model="brand.orderCount" label="订单量"/>
    <v-text-field v-model="brand.url" label="链接地址"/>
    <v-text-field v-model="brand.note" label="备注"/>
    <v-text-field v-model="brand.sort" label="序号"/>
  
    <v-layout row>
      <v-flex xs3>
        <span style="font-size: 16px; color: #444">广告图片：</span>
      </v-flex>
      <v-flex>
        <v-upload
          v-model="brand.pic"
          url="file/adds"
          :multiple="false"
          :pic-width="230"
          :pic-height="120"
        />
      </v-flex>
    </v-layout>
    
    <v-layout class="my-4" row>
      
      <v-spacer/>
      <v-btn @click="submit" color="primary">提交</v-btn>
      <v-btn @click="clear">重置</v-btn>
    </v-layout>
  </v-form>
</template>
<script>
  export default {
    name: "adver-form",
    props: {
      oldAdver: {
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
          id: '',
          name: '', // 品牌名称
          type: 0, 
          pic: '',
          startTime: new Date().toISOString().substr(0, 10),
          endTime: new Date().toISOString().substr(0, 10),
          status: 0,
          clickCount: 0,//点击量
          orderCount: 0, //下单量
          url: '', //链接地址
          note: '',//备注
          sort: 0,//排序 
        },
        // 品牌名称校验
        nameRules: [
          v => !!v || "商品名称不能为空",
        ],
        // 首字母校验
        letterRules: [
          v => !!v || "首字母不能为空",
        ],
        pic: ''
      }
    },
    methods: {
      // 表单提交
      submit() {
        // 表单校验
        if (this.$refs.myAdverForm.validate()) {
          // 定义一个请求参数对象，通过解构表达式来获取brand中的属性
          const {...params} = this.brand;
          // 将数据提交到后台
          // this.$http.post('/item/brand', this.$qs.stringify(params))
          this.$http({
            method: this.isEdit ? 'put' : 'post', // 动态判断是POST还是PUT
            url: 'http://localhost:80/shop/adver/create',
            data: this.$qs.stringify(params)
          }).then(() => {
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
        this.$refs.myAdverForm.reset();
        // 需要手动清空商品分类
        this.categories = [];
      }
    },
    watch: {
      oldAdver: { // 监控oldBrand的变化
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