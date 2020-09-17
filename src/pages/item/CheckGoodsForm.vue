<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step  step="1">商品审核</v-stepper-step>
      <v-divider/>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-flex class="xs10 mx-auto">
          <v-form v-model="valid" ref="basic">
            <v-flex xs3 offset-xs9>
              <v-btn color="info" @click="rollback()">返回</v-btn>
            </v-flex>
            <div>
              <el-select class="el-select"
                v-model="goods.category"
                @change="selectExitSelectConfig"
                filterable
                remote
                placeholder="请选择商品類型"
              >
                <el-option
                  v-for="item in type"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  disabled="disabled"
                />
              </el-select>
              <span>-----</span>
              <el-select
                v-model="goods.category"
                @change="selectLocalSelectConfig"
                filterable
                remote
                placeholder="请选择二級分類 "
              >
                <el-option
                  v-for="t in twotype"
                  :key="t.id"
                  :label="t.name"
                  :value="t.id"
                  disabled="disabled"
                />
              </el-select>
            </div>
            <v-text-field label="商品id" type="" v-model="goods.id" :counter="200" disabled="disabled"
                          hide-details/>
            <v-text-field label="商品名称" v-model="goods.commodityName" :counter="200" required :rules="[v => !!v || '商品名称不能为空']"
                          hide-details disabled="disabled"/>
            <v-text-field label="商品副标题" v-model="goods.commoditySubHead" :counter="200" required :rules="[v => !!v || '商品副标题不能为空']"
                          hide-details disabled="disabled"/>
            <v-text-field label="商品品牌" v-model="goods.brand" :counter="200" hide-details disabled="disabled"/>
            <v-text-field label="商品库存" v-model="goods.inventory" :counter="200" disabled="disabled"
                          hide-details/>
            <v-text-field label="排序" v-model="goods.sort" :counter="1000" disabled="disabled"
                          hide-details/>
            <v-text-field label="商品价格" v-model="goods.price" :counter="1000" disabled="disabled"
                          hide-details/>
            <v-text-field label="商品长度" v-model="goods.length" :counter="1000" disabled="disabled"
                          hide-details/>
            <v-text-field label="商品宽度" v-model="goods.width" :counter="1000" disabled="disabled"
                          hide-details/>
            <v-text-field label="商品高度" v-model="goods.height" :counter="200" hide-details disabled="disabled"/>
            <v-text-field label="商品重量" v-model="goods.weight" :counter="1000" disabled="disabled"
                          hide-details/>
            <v-text-field label="商品属性" v-model="goods.specificType" :counter="1000" disabled="disabled"
                          hide-details/>
            <v-text-field label="商品详情" v-model="goods.productDetail" :counter="1000" disabled="disabled"
                          hide-details/>
            <v-img :src="goods.photo" v-model="goods.photo" width="200" height="200" ></v-img>
            <v-text-field label="审核意见" v-model="vertify.detail" :counter="1000"
                          hide-details/>
          </v-form>
        </v-flex>
        <v-flex xs3 offset-xs9>
          <v-btn color="info" @click="noPass()">审核失败</v-btn>
          <v-btn color="info" @click="pass()">审核通过</v-btn>
        </v-flex>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  import Goods from "./Goods";
  import {post, get, fileUpload} from "../../common/js/http";
  let formData = new FormData();
  var url = "";

  export default {
    name: "goods-form",
    props: {
      oldGoods: {
        type: Object
      },
      isEdit: {
        type: Boolean,
        default: false
      },
      step: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        photos:'',
        type:[],
        twotype:[],
        goodstype:[],
        valid: false,
        goods: {
          id:'',
          category: '', // 商品分类信息
          brand: '', // 品牌信息
          commodityName: '', // 标题
          commoditySubHead: '', // 子标题
          inventory: '',//库存
          sort: 0,
          price:'',
          length:'',
          width:'',
          height:'',
          weight:'',
          specificType: '',
          photo: '',
          productDetail:''
        },
        vertify: {
          productId:'',
          detail:'',
          vertityName:'',
          status:'',
        },
      };
    },
    created() {
      get("/commodityCategory/selByParentId/"+0).then(result =>{
        this.type =result.data;
        console.dir(this.type);
      }).catch(err=>{
        console.dir(err);
      })
      get("/commodity/selectOne/" + this.$route.params.checkId).then(res=>{
        console.dir(res);
        this.goods = res.data;
      });
      get('/user/getInfo').then(res=>{
        console.log(res.data);
        this.vertify.vertityName = res.data.id;
        console.log(this.vertify.vertityName);
      })
    },
    methods: {
      selectExitSelectConfig(val){
        this.twotype = [];
        this.goods.category = null;
        this.getLocalSelectConfig(val);
      },
      getLocalSelectConfig(val) {
        get("/commodityCategory/selByParentId/"+val).then(result =>{
          console.dir(val);
          console.dir(result.data);
          this.twotype =result.data;
        }).catch(err=>{
          console.dir(err);
        })
      },
      selectLocalSelectConfig(val) {
        console.log(val);
      },
      pass(pojo) {
        pojo = this.vertify;
        pojo.status = 0;
        pojo.productId = this.goods.id;
        console.log(pojo);
        post("/commodityVertityRecord/add",pojo).then(()=>{
            this.$confirm("审核成功");
          this.$router.push({name:'Goods'});
        }) .catch(() => {
          this.$message.error("审核出现问题，稍后再试！");
        });
      },
      noPass(pojo) {
        pojo = this.vertify;
        pojo.status = 2;
        pojo.productId = this.goods.id;
        post("/commodityVertityRecord/add",pojo).then(()=>{
          this.$confirm("商品不合格");
          this.$router.push({name:'Goods'});
        }) .catch(() => {
          this.$message.error("审核出现问题，稍后再试！");
        });
      },

      rollback(){
        this.$router.push({name:'Goods'});
      },
    }
  };

</script>

<style scoped>
  .el-select {
    width: 200px;
  }
</style>
