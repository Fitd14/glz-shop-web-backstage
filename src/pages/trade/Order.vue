<template>
  <div>
    <div>
      <div class="searchBox">
        <el-input size="mini" v-model="tableDataName" placeholder="请输入订单编号" style="width:240px"></el-input>
        <el-button type="primary" size="mini" @click="doFilter">搜索</el-button>
      </div>
      <el-table border
                :data="tableDataEnd.slice((currentPage-1)* pageSize,currentPage* pageSize)"
                :current-page.sync="currentPage"
                stripe style="width: 100%;" height='550px' ref="multipleTable">
        <el-table-column prop="orderNo" label="订单编号">
        </el-table-column>
        <el-table-column prop="userId" label="用户ID">
        </el-table-column>
        <el-table-column prop="payment" label="总价"></el-table-column>
        <el-table-column prop="status" label="发货状态">
          <template slot-scope="scope">
            <div v-text="setStatus(scope.row.status)"></div>
          </template>
        </el-table-column>
        <el-table-column prop="paymentStatus" label="支付状态">
          <template slot-scope="scope">
            <div v-text="setSta(scope.row.paymentStatus)"></div>
          </template>
        </el-table-column>
        <el-table-column prop="shipName" label="收件人"></el-table-column>
        <el-table-column prop="phone" label="联系方式"></el-table-column>
        <el-table-column prop="province" label="省份"></el-table-column>
        <el-table-column prop="city" label="城市"></el-table-column>
        <el-table-column prop="region" label="收货地区"></el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作" width="150px" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini" @click="handleEdit(scope.row)">
              查看详情
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
  import {get} from '../../common/js/http';
  import baseUrl from '../../common/js/config'

  // 导入自定义的表单组件
  export default {
    data() {
      return {
        tableDataName: "",
        tableDataEnd: [],
        filterTableDataEnd: [],
        flag: false,
        stata: null,
        revive: null,
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
      this.begin();
    },
    methods: {
      begin() {
        get('/order/all').then(res => {
          console.dir(res.data);
          this.datas = res.data;
          this.totalNum = this.datas.length;
          this.tableDataEnd = this.datas;
        });
        /*  axios.get(url + '/order/all').then(res => {
            console.dir(url + '/order/all')
            console.dir(res.data);
            this.datas = res.data;
            this.totalNum = this.datas.length;
            this.tableDataEnd = this.datas;
          });*/
      },
      currentChangePage(list) {
        let from = (this.currentPage - 1) * this.pageSize;
        let to = this.currentPage * this.pageSize;
        this.tableDataEnd = [];
        for (; from < to; from++) {
          if (list[from]) {
            this.tableDataEnd.push(list[from]);
          }
        }
      },
      //前端搜索功能需要区分是否检索,因为对应的字段的索引不同
      //用两个变量接收currentChangePage函数的参数
      doFilter() {
        if (this.tableDataName == "") {
          this.$message.warning("查询条件不能为空！");
          this.begin();
          return;
        }
        this.tableDataEnd = []
        //每次手动将数据置空,因为会出现多次点击搜索情况
        this.filterTableDataEnd = []
        this.datas.forEach((value, index) => {
          if (value.orderNo) {
            if (value.orderNo.indexOf(this.tableDataName) >= 0) {
              this.filterTableDataEnd.push(value)
            }
          }
        });
        //页面数据改变重新统计数据数量和当前页
        this.currentPage = 1
        this.totalItems = this.filterTableDataEnd.length
        //渲染表格,根据值
        this.currentChangePage(this.filterTableDataEnd)
        //页面初始化数据需要判断是否检索过
        this.flag = true
      },
      setStatus(val) {
        if (val === 0) {
          return "未发货";
        }
        return "已发货";
      },
      setSta(val) {
        this.stata = "aaaa"
        if (val === 1) {
          return "已支付";
        }
        return "未支付";
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;    //动态改变
        this.handleCurrentChange(this.currentPage);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;    //动态改变
        //需要判断是否检索
      },
      handleEdit(row) {
        this.$router.push({name: 'OrderItem', query: {id: row.orderNo}})
      },
      handleDelete(row) {
        console.log(row.id);
        this.$confirm('是否要删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          get('/ship/area/del/' + row.id).then(res => {
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
  .searchBox {
    margin-left: 75%;
  }
</style>
