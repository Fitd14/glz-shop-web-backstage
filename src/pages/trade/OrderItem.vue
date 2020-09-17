<template>
  <div>n
    <div>
      <el-table border
                :data="datas.slice((currentPage-1)* pageSize,currentPage* pageSize)"
                :current-page.sync="currentPage"
                stripe style="width: 100%;" height='550' ref="multipleTable">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="orderNo" label="订单编号"></el-table-column>
        <el-table-column prop="userId" label="用户ID"></el-table-column>
        <el-table-column prop="commodityId" label="商品ID"></el-table-column>
        <el-table-column prop="number" label="数量"></el-table-column>
        <el-table-column prop="price" label="价格（元）"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
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
      axios.get(url + '/orderItem/list?orderNo=' + this.id).then(res => {
        this.datas = res.data;
        this.totalNum = this.datas.length;
      });
    },
    methods: {
      setSta(val) {
        if (val === 0) {
          this.stata = "dfsafd";
        } else {
          this.stata = "val";
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
        this.$router.push({name: 'AddAddress', params: {id: row.id}})
      },
      handleDelete(row) {
        console.log(row.id);
        this.$confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get(url + '/orderItem/orderItem/list' + row.id).then(res => {
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
