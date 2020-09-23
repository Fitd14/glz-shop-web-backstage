<template>
  <div>
    <div>
      <el-table border
                :data="datas.slice((currentPage-1)* pageSize,currentPage* pageSize)"
                :current-page.sync="currentPage"
                stripe style="width: 100%;" height='550' ref="multipleTable">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="orderNo" label="订单号"></el-table-column>
        <el-table-column prop="commodityId" label="商品ID">
        </el-table-column>
        <el-table-column prop="memo" label="描述"></el-table-column>
        <el-table-column prop="img" label="图片描述">
          <template slot-scope="scope">
            <div>
              <img style="width: 120px;height: 150px" :src="scope.row.img"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审核状态">
          <template slot-scope="scope">
            <div v-text="setStatus(scope.row)"></div>
          </template>

        </el-table-column>
        <el-table-column label="操作" width="100%" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini" @click="goDetails(scope.row)" v-text="">
              查看详情
            </el-button>
            <br/>
            <!--  <el-button
                size="mini"
                type="danger" @click="handleDelete(scope.row)">{{message2}}
              </el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
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
        temp: null,
        message1: '通过',
        message2: '驳回',
        id: null,
        stata: null,
        datas: [],
        multipleTable: [],
        currentPage: 1,//默认显示第一页
        pageSize: 5,//默认每页显示10条
        totalNum: 1000 //总页数
      };
    },
    mounted() {
    },
    created() {
      this.beginning();
      /*axios.get(url + '/orderBack/getAll').then(res => {
        this.datas = res.data;
        this.totalNum = this.datas.length;
      });*/
    },
    methods: {
      beginning() {
        get('/orderBack/getAll').then(res => {
          this.datas = res.data;
          this.totalNum = this.datas.length;
        });
      },
      goodsName(val) {
        this.getOne(val).then(resp => {
          console.log(resp.commoditySubHead);
          return resp.commoditySubHead
        })
      },
      getOne(value) {
        return new Promise((resolve, reject) => {
          get('/commodity/selectOne/' + value).then(res => {
            console.dir(res.data)
            resolve(res.data);
          })
        })
      },
      setStatus(row) {
        if (row.status === 0) {
          return '待审核';
        } else if (row.status === 1) {
          return '已通过';
        } else {
          return '已驳回';
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;    //动态改变
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;    //动态改变
      },
      goDetails(row) {
        this.$router.push({name: 'OrderBack', query: {id: row.id, cid: row.commodityId, orderNo: row.orderNo}})
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
            console.dir(res.data);
            get('/orderItem/getByOCid?orderNo=' + row.orderNo + '&' + 'cid=' + row.commodityId).then(res => {
              console.dir('-------------')
              this.temp = res.data;
              this.temp.status = 3;
              post('/orderItem/udp', this.temp).then(res => {
                console.dir('***************')
                console.dir(this.temp);
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
          axios.post(url + '/orderBack/udp', row).then(res => {
            console.dir(res.data);
            axios.get(url + '/orderItem/getByOCid?orderNo=' + row.orderNo + '&' + 'cid=' + row.commodityId).then(res => {
              console.dir('-------------')
              this.temp = res.data;
              this.temp.status = 4;
              axios.post(url + '/orderItem/udp', this.temp).then(res => {
                console.dir('***************')
                console.dir(this.temp);
              });
            })
          })

        });
      },
      toggleSelection(rows) {
        console.dir(rows);
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },

    },
    components: {}
  }
</script>

<style scoped>

</style>
