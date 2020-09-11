<template>
  <v-card>
    <v-toolbar class="elevation-0">
      <v-btn color="primary" @click="addGoods" >新增商品</v-btn>
      <v-spacer/>
      <v-flex xs3>
        状态：
        <v-btn-toggle mandatory v-model.lazy="filter.saleable">
          <v-btn flat :value=2>
            其他：全部
          </v-btn>
          <v-btn flat :value=0>
            0：上架
          </v-btn>
          <v-btn flat :value=1>
            1：下架
          </v-btn>
        </v-btn-toggle>
      </v-flex>
      <v-flex xs3>
        <v-text-field
          append-icon="search"
          label="搜索"
          single-line
          hide-details
          v-model="filter.putawayStatus"
        />
      </v-flex>
    </v-toolbar>
    <v-divider/>
    <v-data-table
      :headers="headers"
      :items="goodsList"
      :pagination.sync="pagination"
      :total-items="totalGoods"
      :loading="loading"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.commodityName }}</td>
        <td class="text-xs-center">{{props.item.category}}</td>
        <td class="text-xs-center">{{ props.item.brand }}</td>
        <td class="text-xs-center">{{props.item.price}}</td>
        <td class="text-xs-center">{{ props.item.createTime }}</td>
        <td class="text-xs-center">{{ props.item.updateTime }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="editGoods(props.item)">
            <i class="el-icon-edit"/>
          </v-btn>
          <v-btn icon @click="deleteGoods(props.item)">
            <i class="el-icon-delete"/>
          </v-btn>
          <v-btn icon v-if="props.item.putawayStatus === 1" @click="editSaleable(props.item)">下架</v-btn>
          <v-btn icon v-else @click="editSaleable(props.item)">上架</v-btn>
        </td>
      </template>
    </v-data-table>
    <!--弹出的对话框-->
    <v-dialog max-width="800" v-model="show" persistent scrollable>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>{{isEdit ? '修改' : '新增'}}商品</v-toolbar-title>
          <v-spacer/>
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-3" style="height: 600px">
          <goods-form :oldGoods="this.oldGoods" :step="step" @close="closeWindow" :is-edit="isEdit" ref="goodsForm"/>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>

  // 导入自定义的表单组件
  import GoodsForm from './GoodsForm'
  var PATH = "http://localhost:80";
  export default {
    name: "goods",
    data() {
      return {
        filter: {
          saleable: true, // 上架还是下架
          putawayStatus: '', // 搜索过滤字段
          pageNo: 0,
          pageSize: 0,
        },
        totalGoods: 0, // 总条数
        goodsList: [], // 当前页品牌数据
        loading: true, // 是否在加载中
        pagination: {}, // 分页信息
        goodtype: [],//商品分类信息
        headers: [
          {text: 'id', align: 'center', sortable: false, value: 'id'},
          {text: '标题', align: 'center', sortable: false, value: 'commodityName'},
          {text: '商品分类', align: 'center', sortable: false, value: 'category'},
          {text: '品牌', align: 'center', sortable: false, value: 'brand'},
          {text: '价格', align: 'center', sortable: false, value: 'price'},
          {text: '创建时间', align: 'center', sortable: false, value: 'createTime'},
          {text: '跟新时间', align: 'center', value: 'updateTime', sortable: false,},
          {text: '操作', align: 'center', sortable: false}
        ],
        show: false,// 控制对话框的显示
        oldGoods: {}, // 即将被编辑的商品信息
        isEdit: false, // 是否是编辑
        step: 1, // 子组件中的步骤线索引，默认为1
      }
    },
    mounted() { // 渲染后执行
      // 查询数据
      this.getDataFromServer();
    },
    watch: {
      pagination: { // 监视pagination属性的变化
        deep: true, // deep为true，会监视pagination的属性及属性中的对象属性变化
        handler() {
          // 变化后的回调函数，这里我们再次调用getDataFromServer即可
          this.getDataFromServer();
        }
      },
      filter: {// 监视搜索字段
        handler() {
          this.getDataFromServer();
        },
        deep: true
      }
    },
    methods: {
      getDataFromServer() { // 从服务的加载数的方法。
        //发起请求
        this.$http.get(PATH + "/commodity/sel",
          {
            params: {
            putawayStatus: this.filter.putawayStatus, // 搜索条件
            //saleable:  this.filter.saleable, // 上下架
            pageNo: this.pagination.page,// 当前页
            pageSize: this.pagination.rowsPerPage,// 每页大小
          }
        }
        ).then(resp => { // 这里使用箭头函数
          this.goodsList = resp.data.data;
          this.totalGoods = resp.data.data.length;
          // 完成赋值后，把加载状态赋值为false
          this.loading = false;
        })

      },
      addGoods() {
        this.goodtype = this.$http.get(PATH+"/commodityCategory/selAll");
        // 修改标记
        this.isEdit = false;
        // 控制弹窗可见：
        this.show = true;
        // 把oldBrand变为null
        this.oldGoods = {};
      },
      async editGoods(oldGoods) {
        // 发起请求，查询商品详情和skus
        oldGoods = await this.$http.loadData(PATH+"/commodity/selectOne/" + oldGoods.id);
        //oldGoods.skus = await this.$http.loadData(PATH+"/commodity/selectOne/" + oldGoods.id);
        // 修改标记
        this.isEdit = true;
        // 控制弹窗可见：
        this.show = true;
        // 获取要编辑的goods
        this.oldGoods = oldGoods;
      },
      deleteGoods(item) {
        this.$message.confirm('此操作将永久删除该商品, 是否继续?').then(() => {
          console.dir(item.id);
          // 发起删除请求
          this.$http.get(PATH+"/commodity/del/" + item.id)
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
      editSaleable(item) {
        // 发起请求
        var status =item.putawayStatus==0?1:0;
        this.$http.get(PATH+"/commodity/away?id="+item.id+"&putawayStatus="+status )
            .then(resp => { // 这里使用箭头函数
              this.getDataFromServer();
            })
      },
      closeWindow() {
        console.log(1)
        // 重新加载数据
        this.getDataFromServer();
        // 关闭窗口
        this.show = false;
        // 将步骤调整到1
        this.step = 1;
      },
      previous() {
        if (this.step > 1) {
          this.step--
        }
      },
      next() {
        if (this.step < 4 && this.$refs.goodsForm.$refs.basic.validate()) {
          this.step++
        }
      }
    },
    components: {
      GoodsForm
    }
  }
</script>

<style scoped>

</style>
