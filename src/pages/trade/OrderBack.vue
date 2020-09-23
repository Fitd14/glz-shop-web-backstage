<template>
  <div>
    <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>详情</span>
          <el-button style="float: right; padding: 3px 0" @click="goBack()" type="text">返回</el-button>
        </div>
        <div class="text item">
          <el-divider content-position="left">退单描述</el-divider>
          <span> {{orderBack.memo}}</span>
        </div>
        <div class="text item">
          <el-divider content-position="left">图片描述</el-divider>
          <el-image style="width: 10%;height: 15%" :src="orderBack.img"></el-image>
        </div>
        <div class="text item" style="align-content: center">
          <el-divider content-position="left"></el-divider>
          <el-button @click="handleEdit(orderBack)" type="warning" size="mini" plain>同意</el-button>
          <el-button @click="handleDelete(orderBack)" type="danger" size="mini" plain>駁回</el-button>
        </div>
      </el-card>

    </div>
  </div>
</template>
<script>
  import axios from 'axios';
  import {get, post} from "../../common/js/http";
  import baseUrl from '../../common/js/config'
  // 导入自定义的表单组件
  export default {
    data() {
      return {
        id: '',
        cid: '',
        orderNo: '',
        message1: '',
        orderBack: null,
        orderItem: null,

      };
    },
    mounted() {
    },
    created() {
      this.id = this.$route.query.id;
      this.cid = this.$route.query.cid;
      this.orderNo = this.$route.query.orderNo
      console.dir(this.id);
      console.dir(this.cid);
      console.dir(this.orderNo)

      get("orderBack/sel/id", {id: this.id}).then(res => {
        console.dir(res);
        this.orderBack = res.data;
      })
    },
    methods: {
      goBack() {
        this.$router.go(-1);//返回上一层
      },
      handleEdit(row) {
        this.$confirm('是否要通过该申请', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = 1;
          console.dir(row);
          post('/orderBack/udp', row).then(res => {
            get('/orderItem/getByOCid?orderNo=' + row.orderNo + '&' + 'cid=' + row.commodityId).then(res => {
              console.dir('-------------')
              this.orderItem = res.data;
              this.orderItem.status = 3;
              post('/orderItem/udp', this.orderItem).then(res => {
                console.dir('***************')
                console.dir(this.temp);
                this.$router.go(-1);//返回上一层
              });
            })
          })

        });
      },
      handleDelete(row) {
        this.$confirm('是否要駁回该申请', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          row.status = 2;
          console.dir(row);
          post('/orderBack/udp', row).then(res => {
            get('/orderItem/getByOCid?orderNo=' + row.orderNo + '&' + 'cid=' + row.commodityId).then(res => {
              console.dir('-------------')
              this.orderItem = res.data;
              this.orderItem.status = 4;
              post('/orderItem/udp', this.orderItem).then(res => {
                console.dir('***************')
                console.dir(this.temp);
                this.$router.go(-1);//返回上一层
              });
            })
          })
        });
      },
    },
    components: {}
  }
</script>

<style scoped>
  .box-card {
    width: 500px;
    height: 400px;
    margin: 0 auto;
  }

  .item {
    margin: 0 auto;
  }
</style>
