<template>
  <v-card>
    <v-toolbar class="elevation-0">
      <v-btn color="primary" @click="addGoods" >新增商品</v-btn>
      <v-spacer/>
      <v-flex xs8>
        <v-btn-toggle mandatory >
          <el-input v-model="goods.commodityName" placeholder="搜索商品名" style="width: 200px"></el-input>
            <el-select class="el-select"
                       v-model="goods.category"
                       placeholder="请选择商品類型"
                       style="width: 200px"
            >
              <el-option
                v-for="item in type"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          <el-switch
            v-model="goods.putawayStatus"
            active-text="上架"
            @change="textchange"
            inactive-text="下架">
          </el-switch>
          <el-button @click="selLikeOption(goods)">搜索</el-button>
          <el-button @click="relaseSel">重置</el-button>
        </v-btn-toggle>
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
        <!--<td class="text-xs-center">{{ props.item.id }}</td>-->
        <td class="text-xs-center">
          <img :src="props.item.photo" width="80" height="40" >
        </td>
        <td class="text-xs-center">{{props.item.commodityName }}</td>
        <td class="text-xs-center" >{{props.item.category}}</td>
        <td class="text-xs-center">{{props.item.brand }}</td>
        <td class="text-xs-center">{{props.item.price}}</td>
        <td class="text-xs-center">{{props.item.createTime }}</td>
        <td class="text-xs-center">{{props.item.updateTime }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="editGoods(props.item)">
            <i class="el-icon-edit"/>
          </v-btn>
          <v-btn icon @click="deleteGoods(props.item)">
            <i class="el-icon-delete"/>
          </v-btn>
          <v-btn icon v-if="props.item.putawayStatus === 1" @click="editSaleable(props.item)">下架</v-btn>
          <v-btn icon v-else @click="editSaleable(props.item)">上架</v-btn>
          <v-btn v-if="props.item.status===1" @click="CheckShop(props.item)">审核商品</v-btn>
          <v-btn v-else-if="props.item.status===0" >审核已通过</v-btn>
          <v-btn v-else="props.item.status===2" @click="CheckShop(props.item)">再次审核</v-btn>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  var Path = "http://192.168.115.60:100/";
  // 导入自定义的表单组件
  import GoodsForm from './GoodsForm';
  import {get,post} from "../../common/js/http";
  export default {
    name: "goods",
    data() {
      return {
        type: [],
        filter: {
          pageNo: 0,
          pageSize: 0,
        },
        totalGoods: 0, // 总条数
        goodsList: [], // 当前页品牌数据
        loading: true, // 是否在加载中
        pagination: {
        }, // 分页信息
        goodtype: {},//商品分类信息
        headers: [
          //{text: 'id', align: 'center', sortable: false, value: 'id'},
          {text: '照片', align: 'center', sortable: false, value:'photo'},
          {text: '商品名称', align: 'center', sortable: false, value: 'commodityName'},
           {text: '商品分类', align: 'center', sortable: false, value: 'category'},
          {text: '品牌', align: 'center', sortable: false, value: 'brand'},
          {text: '价格', align: 'center', sortable: false, value: 'price'},
          {text: '创建时间', align: 'center', sortable: false, value: 'createTime'},
          {text: '跟新时间', align: 'center', value: 'updateTime', sortable: false,},
          {text: '操作', align: 'center', sortable: false}
        ],
        isOne: '',
        show: false,// 控制对话框的显示
        oldGoods: {}, // 即将被编辑的商品信息
        isEdit: false, // 是否是编辑
        step: 1, // 子组件中的步骤线索引，默认为1
        baseImg:[],
        imgShow:'',
        goods:{
          commodityName:'',
          brand:'',
          putawayStatus: true, // 搜索过滤字段
          price: '',
          category:'',
        }
      }
    },
    created() {
      get("/commodityCategory/selAll").then(res=>{
        console.log(res.data);
        this.type = res.data;
      })
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
          if (this.isOne ==1) {
            this.getDataFromServer();
          }else {
            this.selLikeOption();
          }
        }
      },
      filter: {// 监视搜索字段
        handler() {
          if (this.isOne ==1) {
            this.getDataFromServer();
          }else {
            this.selLikeOption();
          }
        },
        deep: true
      }
    },
    methods: {
      relaseSel(){
        location.reload();
      },
      textchange(){
        //console.log(this.goods.putawayStatus);
      },
      selLikeOption(item){
        this.isOne =2;
        if (item.putawayStatus == true){
          console.log(this.goods.putawayStatus);
          item.putawayStatus = 1;
        }else {
          console.log(this.goods.putawayStatus);
          item.putawayStatus = 0;
        }
        console.log(item);
        if (item.category =='' && item.commodityName ==''){
          get("/commodity/sel",{putawayStatus: item.putawayStatus
          ,pageNo: this.pagination.page-1,// 当前页
            pageSize: this.pagination.rowsPerPage}).then(res=>{
              if (res.data == null){
                this.$message.error("没有此商品")
              }
            console.log(res.data);
            this.goodsList = res.data;
            this.goods.putawayStatus = item.putawayStatus==true?true:false;
          })
        }else if (item.category =='' && item.commodityName !=''){
          get("/commodity/sel",{commodityName: item.commodityName,
            putawayStatus: item.putawayStatus,pageNo: this.pagination.page-1,// 当前页
            pageSize: this.pagination.rowsPerPage}).then(res=>{
            if (res.data == null){
              this.$message.error("没有此商品")
            }
            console.log(res.data);
            this.goodsList = res.data;
            this.goods.putawayStatus = item.putawayStatus==true?true:false;
          }).catch(() => {
            this.$message.error("没有此商品！");
          });
        }else if (item.category !='' && item.commodityName ==''){
          get("/commodity/sel",{
            category: item.category,putawayStatus: item.putawayStatus
          ,pageNo: this.pagination.page-1,// 当前页
            pageSize: this.pagination.rowsPerPage}).then(res=>{
            if (res.data == null){
              this.$message.error("没有此商品")
            }
            console.log(res.data);
            this.goodsList = res.data;
            this.goods.putawayStatus = item.putawayStatus==true?true:false;
          }).catch(() => {
            this.$message.error("没有此商品！");
          });
        }else {
          get("/commodity/sel", {
            commodityName: item.commodityName,
            category: item.category, putawayStatus: item.putawayStatus
            ,pageNo: this.pagination.page-1,// 当前页
            pageSize: this.pagination.rowsPerPage
          }).then(res => {
            if (res.data == null){
              this.$message.error("没有此商品")
            }
            this.goodsList = res.data;
            this.goods.putawayStatus = item.putawayStatus==true?true:false;
          }).catch(() => {
            this.$message.error("没有此商品！");
          });
        }
      },
      getDataFromServer() { // 从服务的加载数的方法。
        this.isOne = 1;
        //发起请求
        get("/commodity/sel",
          {
            // params: {
            //putawayStatus: this.filter.putawayStatus, // 搜索条件
            //saleable:  this.filter.saleable, // 上下架
            pageNo: this.pagination.page-1,// 当前页
            pageSize: this.pagination.rowsPerPage,// 每页大小
        }
        ).then(resp => { // 这里使用箭头函数
          get("/commodity/selectAll").then(res=>{
            this.totalGoods = res.data.length;
          })
          this.goodsList = resp.data;
          console.log(this.goodsList);
          // 完成赋值后，把加载状态赋值为false
          this.loading = false;
        });
      },
      addGoods() {
        this.$router.push({name:'GoodsForm'});
        // 修改标记
        this.isEdit = false;
        // 把oldBrand变为null
        this.oldGoods = {};
      },
      async editGoods(oldGoods) {
        this.$router.push({name:'EditGoodsForm',params:{"editId":oldGoods.id}});
      },
      deleteGoods(item) {
        this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.dir(item.id);
          // 发起删除请求
          get("/commodity/del/" + item.id)
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
        console.log(item);
        if(item.status===0){
          get("/commodity/away?id="+item.id+"&putawayStatus="+status )
              .then(resp => { // 这里使用箭头函数
                this.getDataFromServer();
              }).catch(err=>{
                console.dir(err);
          })
        }else{
          this.$confirm("商品审核没有通过");
        }
      },
      CheckShop(item) {
        get('/user/getInfo').then(res=>{
          console.log(res.data.id);
          if (res.data.id ==null){
            this.$router.push({name:'Login'});
          }else {
            this.$router.push({name:'CheckGoodsForm',params:{"checkId":item.id}})
          }
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
    },
    components: {
      GoodsForm
    },

  }
</script>

<style scoped>

</style>
