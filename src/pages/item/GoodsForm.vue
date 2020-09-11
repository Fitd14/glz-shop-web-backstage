<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step  step="1">基本信息</v-stepper-step>
      <v-divider/>
<!--      <v-stepper-step :complete="step > 3" step="3">规格参数</v-stepper-step>-->
<!--      <v-divider/>-->
<!--      <v-stepper-step step="4">SKU属性</v-stepper-step>-->
    </v-stepper-header>
    <v-stepper-items>
      <!--1、基本信息-->
      <v-stepper-content step="1">
        　
        <v-flex class="xs10 mx-auto">
          <v-form v-model="valid" ref="basic">
<!--            <v-layout row>-->
<!--              <v-flex xs5>-->
<!--                &lt;!&ndash;商品分类&ndash;&gt;-->
<!--                <v-cascader-->
<!--                  url="http://localhost:9500/commodityCategory/selAll"-->
<!--                  required-->
<!--                  showAllLevels-->
<!--                  v-model="goods.categories"-->
<!--                  label="请选择商品分类"/>-->

<!--&lt;!&ndash;                <v-select&ndash;&gt;-->
<!--&lt;!&ndash;                  :items="brandOptions"&ndash;&gt;-->
<!--&lt;!&ndash;                  item-text="name"&ndash;&gt;-->
<!--&lt;!&ndash;                  item-value="id"&ndash;&gt;-->
<!--&lt;!&ndash;                  label="所属品牌"&ndash;&gt;-->
<!--&lt;!&ndash;                  v-model="goods.brandId"&ndash;&gt;-->
<!--&lt;!&ndash;                  required&ndash;&gt;-->
<!--&lt;!&ndash;                  autocomplete&ndash;&gt;-->
<!--&lt;!&ndash;                  clearable&ndash;&gt;-->
<!--&lt;!&ndash;                  dense chips&ndash;&gt;-->
<!--&lt;!&ndash;                  :rules="[v => !!v || '品牌不能为空']"&ndash;&gt;-->
<!--&lt;!&ndash;                >&ndash;&gt;-->
<!--&lt;!&ndash;                  <template slot="selection" slot-scope="data">&ndash;&gt;-->
<!--&lt;!&ndash;                    <v-chip small>{{ data.item.name}}</v-chip>&ndash;&gt;-->
<!--&lt;!&ndash;                  </template>&ndash;&gt;-->
<!--&lt;!&ndash;                </v-select>&ndash;&gt;-->
<!--              </v-flex>-->
<!--              <v-spacer/>-->
<!--            </v-layout>-->
            <v-text-field label="商品名称" v-model="goods.commodityName" :counter="200" required :rules="[v => !!v || '商品名称不能为空']"
                          hide-details/>
            <v-text-field label="商品副标题" v-model="goods.commoditySubHead" :counter="200" required :rules="[v => !!v || '商品品牌不能为空']"
                          hide-details/>
<!--            <v-select label="222"-->
<!--              :item="goodtype"-->
<!--            >-->
<!--            </v-select>-->
            <select v-model="goods.category" >
              <option v-for="type of goodtype" name="sendSymbolId" :value="type.id">{{type.name}}</option>
            </select>


            <v-text-field label="商品类型" v-model="goods.category" :counter="200" required :rules="[v => !!v || '商品标题不能为空']"
                          hide-details/>
            <v-text-field label="商品品牌" v-model="goods.brand" :counter="200" hide-details/>
            <v-text-field label="商品库存" v-model="goods.inventory" :counter="1000" multi-line :rows="3"
                          hide-details/>
            <v-text-field label="排序" v-model="goods.sort" :counter="1000" multi-line :rows="3"
                          hide-details/>
            <v-text-field label="商品价格" v-model="goods.price" :counter="1000" multi-line :rows="3"
                          hide-details/>
            <v-text-field label="商品长度" v-model="goods.length" :counter="1000" multi-line :rows="3"
                          hide-details/>
            <v-text-field label="商品宽度" v-model="goods.width" :counter="1000" multi-line :rows="3"
                          hide-details/>
            <v-text-field label="商品高度" v-model="goods.height" :counter="200" hide-details/>
            <v-text-field label="商品重量" v-model="goods.weight" :counter="1000" multi-line :rows="3"
                          hide-details/>
            <v-text-field label="商品属性" v-model="goods.specificType" :counter="1000" multi-line :rows="3"
                          hide-details/>
            <v-btn>
            <input  type="file"  name="files" accept="image/png,image/gif,image/jpeg" multiple="multiplt" @change="upload($event)"/>
            </v-btn>
          </v-form>
        </v-flex>
        <v-flex xs3 offset-xs9>
          <v-btn color="info" @click="submit(goods)">保存商品信息</v-btn>
        </v-flex>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
  import Goods from "./Goods";
  var PATH = "http://localhost:80";
  let formData = new FormData();

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
      },
      goodtype:{
        type:[]
      },

    },
    data() {
      return {
        valid: false,
        goods: {
          category: [], // 商品分类信息
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
          photo: ''
        },

      };
    },

      methods: {

        submit(pojo) {
          console.dir(formData);
          this.$http.post(PATH+"/commodity/upload",formData,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(result =>{
            console.log(result);
            this.goods.photo = result.data;
            this.$http.post(PATH + "/commodity/save", this.goods).then(() => {
              this.$emit("close");
              // 提示成功
              this.$message.success("保存成功了");
            })
              .catch(() => {
                this.$message.error("保存失败！");
              });
          });
          console.dir(pojo);

        },
        upload(event) {
          console.dir(event.target.files);
          for (let i = 0; i < event.target.files.length; i++) {
            formData.append("files", event.target.files[i]);
            console.log(event.target.files[i]);
          }
        }
      }
  };

</script>

<style scoped>
</style>
