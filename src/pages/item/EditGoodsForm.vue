<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step  step="1">基本信息</v-stepper-step>
      <v-divider/>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-flex xs3 offset-xs9>
          <v-btn color="info" @click="rollback()">返回</v-btn>
        </v-flex>
        <v-flex class="xs10 mx-auto">
          <v-form v-model="valid" ref="basic">

            <div>
              <el-select
                v-model="goods.category"
                value-key="goods.category"
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
                />
              </el-select>
              <span>-----</span>
              <el-select
                v-model="goods.category"
                value-key="goods.category"
                @change="selectLocalSelectConfig"
                filterable
                remote
                placeholder="请选择二級分類 "
                style="width:60%"
              >
                <el-option
                  v-for="t in twotype"
                  :key="t.id"
                  :label="t.name"
                  :value="t.id"
                />
              </el-select>
            </div>
            <v-text-field label="商品id" type="" v-model="goods.id" :counter="200"
                          hide-details/>
            <v-text-field label="商品名称" v-model="goods.commodityName" :counter="200" required :rules="[v => !!v || '商品名称不能为空']"
                          hide-details/>
            <v-text-field label="商品副标题" v-model="goods.commoditySubHead" :counter="200" required :rules="[v => !!v || '商品副标题不能为空']"
                          hide-details/>
            <v-text-field label="商品品牌" v-model="goods.brand" :counter="200" hide-details/>
            <v-text-field label="商品库存" v-model="goods.inventory" :counter="200"
                          hide-details/>
            <v-text-field label="排序" v-model="goods.sort" :counter="1000"
                          hide-details/>
            <v-text-field label="商品价格" v-model="goods.price" :counter="1000"
                          hide-details/>
            <v-text-field label="商品长度" v-model="goods.length" :counter="1000"
                          hide-details/>
            <v-text-field label="商品宽度" v-model="goods.width" :counter="1000"
                          hide-details/>
            <v-text-field label="商品高度" v-model="goods.height" :counter="200" hide-details/>
            <v-text-field label="商品重量" v-model="goods.weight" :counter="1000"
                          hide-details/>
            <v-text-field label="商品属性" v-model="goods.specificType" :counter="1000"
                          hide-details/>
            <v-text-field label="商品详情" v-model="goods.productDetail" :counter="1000"
                          hide-details/>
<!--            <v-img  label="商品图片" v-model="goods.photo" :counter="1000" :src="goods.photo"-->
<!--                          hide-details/>-->
            <!--<v-layout row>
              <v-flex xs3>
                <span style="font-size: 16px; color: #444">商品图片：</span>
              </v-flex>
              <v-flex>
                <v-upload
                  v-model="photos"
                  url="/commodity/upload"
                  :multiple="true"
                  :pic-width="250"
                  :pic-height="90"
                />
              </v-flex>
            </v-layout>-->
          </v-form>
        </v-flex>
        <v-flex xs3 offset-xs9>
          <v-btn color="info" @click="submit(goods)">保存修改商品信息</v-btn>
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
      };
    },
    created() {
      get("/commodityCategory/selByParentId/"+0).then(result =>{
        this.type =result.data;
        console.dir(this.type);
      }).catch(err=>{
        console.dir(err);
      })
      get("/commodity/selectOne/" + this.$route.params.editId).then(res=>{
        console.dir(res);
        this.goods = res.data;
      });
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
      submit(pojo) {
        console.dir(this.photos);
        for (var i=0;i<this.photos.length;i++){
          if (this.photos.length===1){
            url = this.photos[i];
          }else {
            url += this.photos[i]+",";
          }
        }
        this.photo = url;
        console.dir(url);
        // fileUpload("/commodity/upload",formData).then((result) =>{
        //   console.dir(result.data);
        //var object = this.goods;
        post("/commodity/update", this.goods).then(() => {
          // 提示成功
          this.$message.success("保存成功了");
          this.rollback();
        })
          .catch(() => {
            this.$message.error("保存失败！");
          });
        //   .catch(err=>{
        //   console.dir(err);
        // });
      },
      /*upload(event) {

        for (let i = 0; i < event.target.files.length; i++) {
          console.dir(event.target.files[i]);

          formData.append("file", event.target.files[i]);
          console.dir("---------------");
          console.log(formData);
        }
      },*/
      rollback(){
        this.$router.push({name:'Goods'});
      },
    }
  };

</script>

<style scoped>
</style>
