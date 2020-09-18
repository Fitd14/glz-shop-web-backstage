<template>
  <div>
    <div>
      <el-table border
                :data="datas.slice((currentPage-1)* pageSize,currentPage* pageSize)"
                :current-page.sync="currentPage"
                stripe style="width: 100%;" height='550' ref="multipleTable">
        <el-table-column prop="id" v-if="false" label="ID"></el-table-column>
        <el-table-column prop="orderNo" label="订单编号"></el-table-column>
        <el-table-column prop="userId" label="用户ID"></el-table-column>
        <el-table-column prop="commodityId" label="商品ID"></el-table-column>
        <el-table-column prop="commoditySubHead" label="商品名称"></el-table-column>
        <el-table-column prop="img" label="商品图片">
          <template slot-scope="scope">
            <el-image :src="scope.row.img"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="number" label="数量"></el-table-column>
        <el-table-column prop="price" label="价格（元）"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <div v-text="changeStatus(scope.row.status)"></div>
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="备注"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作" width="100%" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini" disabled @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <br/>
            <el-button
              size="mini"
              type="danger" disabled @click="handleDelete(scope.row)">删除
            </el-button>
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
  import {get} from '../../common/js/http'
  import baseUrl from '../../common/js/config'

  const url = 'http://localhost:8070';
  // 导入自定义的表单组件
  export default {
    data() {
      return {
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
      this.id = this.$route.query.id
      console.dir(this.id);
      get('/orderItem/list?orderNo=' + this.id).then(res => {
        this.datas = res.data;
        this.totalNum = this.datas.length;
      });
      /* axios.get(url + '/orderItem/list?orderNo=' + this.id).then(res => {
         this.datas = res.data;
         this.totalNum = this.datas.length;
       });*/
    },
    methods: {
      changeStatus(val) {
        if (val === 0) {
          return '未发货';
        } else if (val === 1) {
          return '已发货';
        } else if (val === 2) {
          return '已申请退货';
        } else if (val === 3) {
          return '已退货';
        } else {
          return '退货失败';
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
      handleEdit(row) {
        this.$router.push({name: 'OrderBack', query: {id: row.id, cid: row.commodityId, orderNo: row.orderNo}})
      },
      handleDelete(row) {
        console.log(row.id);
        this.$confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          get('/orderItem/orderItem/list' + row.id).then(res => {
            if (res.data.code === '200') {
              this.reload();
              console.dir('success');
            }
          });
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
