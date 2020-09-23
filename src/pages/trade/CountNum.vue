<template>
  <div>
    <div>
      <div class="showtable">
        <span>各省销售统计<el-button style="float: right; padding: 3px 20px" @click="goBack()" type="text">返回</el-button></span>
        <br/>
      </div>
      <br/>
      <el-table align="center" size="mini" border class="showtable"
                :data="sellCount"
                :header-cell-style="{'text-align':'center'}"
                stripe style="width: 50%;" ref="multipleTable">
        <el-table-column align="center" prop="province" label="省份">
        </el-table-column>
        <el-table-column align="center" prop="num" label="销量">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';
  import {get, post} from '../../common/js/http';
  import baseUrl from '../../common/js/config'

  // 导入自定义的表单组件
  export default {
    data() {
      return {
        sellCount: [],
      };
    },
    mounted() {
    },
    created() {
      this.begin();
    },
    methods: {
      begin() {
        get('/order/count').then(res => {
          console.dir(res.data);
          this.sellCount = res.data;
        })
      },
      goBack() {
        this.$router.go(-1);//返回上一层
      },
    },
    components: {}
  }
</script>

<style scoped>
  .searchBox {
    margin-left: 15%;
  }

  .showtable {
    text-align: center;
    margin: 0 auto;
  }
</style>
