<template>
    <v-card>
    <v-card-title flat color="white">
      <!--新增按钮-->
      <v-btn color="primary" @click="addNewProduct">新增活动</v-btn>
      <!--搜索框，与search属性关联-->
      <!--空间隔离组件-->
      <v-spacer/>
      <v-flex xs3>
        <v-text-field label="输入关键字搜索" v-model.lazy="search" append-icon="search" hide-details/>
      </v-flex>
    </v-card-title>
    <v-divider/>
    <!--列表-->
    <v-data-table
      :headers="headers"
      :items="brands"
      :pagination.sync="pagination"
      :total-items="totalBrands"
      :loading="loading"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.productId }}</td>
        <td class="text-xs-center">{{ props.item.productName }}</td>
        <td class="text-xs-center">
          <p v-if="props.item.recommendStatus=0">上线</p><p v-else-if="props.item.recommendStatus=1">下线</p></td>
        <td class="text-xs-center">{{ props.item.sort }}</td>
        <!--编辑按钮-->
        <td class="justify-center layout px-0">
          <v-btn icon @click="editBrand(props.item)">
            <i class="el-icon-edit"/>
          </v-btn>
          <v-btn icon @click="deleteBrand(props.item)">
            <i class="el-icon-delete"/>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <!--弹出的对话框-->
    <v-dialog max-width="500" v-model="show" persistent scrollable>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>{{isEdit ? '修改' : '新增'}}活动</v-toolbar-title>
          <v-spacer/>
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-5" style="height:400px">
          <brand-form @close="closeWindow" :oldBrand="oldBrand" :isEdit="isEdit"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
     // 导入自定义的表单组件
  import BrandForm from './NewProductFrom';
     import {get,post} from "../../common/js/http";
  var url = 'http://localhost:80/shop/newProduct/';

  export default {
    name: "newProduct",
    data() {
      return {
        search: '', // 搜索关键字
        totalBrands: 0, // 总条数
        brands: [], // 当前页品牌数据
        loading: true, // 是否在加载中
        pagination: {}, // 分页信息
        headers: [  // 表头
          {text: 'id', align: 'center', value: 'id'},
          {text: '商品ID', align: 'center', sortable: false, value: 'productId'},
          {text: '商品名', align: 'center', sortable: false, value: 'productName'},
          {text: '状态', align: 'center', value: 'recommendStatus'},
          {text: '排序', align: 'center', value: 'sort', sortable: true,},
          {text: '操作', align: 'center', value: 'id', sortable: false}
        ],
        show: false,// 控制对话框的显示
        oldBrand: {}, // 即将被编辑的品牌数据
        isEdit: false, // 是否是编辑
      }
    },
    mounted() { // 渲染后执行
      // 查询数据
      this.getDataFromServer(); // 调用数据初始化函数
    },
    watch: {
      pagination: { // 监视pagination属性的变化
        deep: true, // deep为true，会监视pagination的属性及属性中的对象属性变化
        handler() {
          // 变化后的回调函数，这里我们再次调用getDataFromServer即可
          this.getDataFromServer();
        }
      },
      search: { // 监视搜索字段
        handler() {
          this.getDataFromServer();
        }
      }
    },
    methods: {
      getDataFromServer() { // 从服务的加载数的方法。
        // 发起请求
        get("/shop/newProduct/getList", {
          params: {
            key: this.search, // 搜索条件
            page: this.pagination.page,// 当前页
            rows: this.pagination.rowsPerPage,// 每页大小
            sortBy: this.pagination.sortBy,// 排序字段
            desc: this.pagination.descending// 是否降序
          }
        }).then(resp => { // 这里使用箭头函数
          // 品牌数据
          console.dir(resp);
          this.brands = resp.data;
          // 总条数
          this.totalBrands = resp.data.length;
          // 完成赋值后，把加载状态赋值为false
          this.loading = false;
        })
      },
      addNewProduct() {
        // 修改标记
        this.isEdit = false;
        // 控制弹窗可见：
        this.show = true;
        // 把oldBrand变为null
        this.oldBrand = null;
      },
      editBrand(oldBrand) {
        // 根据品牌信息查询商品分类
        get("/shop/newProduct/getId/" + oldBrand.id)
            .then(({data}) => {
              // 修改标记
              this.isEdit = false;
              // 控制弹窗可见：
              this.show = true;
              // 获取要编辑的brand
              this.oldBrand = oldBrand;
              // 回显商品分类
              this.oldBrand.categories = data.data;
            })
      },
      deleteBrand(item) {
        this.$message.confirm('此操作将永久删除该品牌, 是否继续?').then(() => {
          // 发起删除请求
          get("/shop/newProduct/delete/" + item.id)
              .then(() => {
                // 删除成功
                this.$message.success("删除成功！");
                // 重新加载数据
                this.getDataFromServer();
              })
              .catch(() => {
                // 删除失败
                this.$message.info("删除已取消！");
              });
        });
      },
      closeWindow() {
        // 重新加载数据
        this.getDataFromServer();
        // 关闭窗口
        this.show = false;
      }
    },
    components: {
      BrandForm
    }
  }
</script>

<style scoped>

</style>
