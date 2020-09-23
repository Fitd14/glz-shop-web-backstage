<template>
  <div>
    <div>
      <div class="searchBox">
        <el-form :inline="true" :model="criteria" class="demo-form-inline">
          <el-form-item label="请选择日期">
            <el-date-picker
              v-model="criteria.createTime"
              type="date"
              size="mini"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="区域">
            <el-select size="mini" v-model="criteria.province">
              <el-option label="" value=""></el-option>
              <el-option v-for="item in this.arealist" :key="item.pname" :label="item.pname"
                         :value="item.pname"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input size="mini" v-model="criteria.userName" placeholder="请输入用户名" style="width:240px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="dySel(criteria)">搜索</el-button>
            <el-button type="primary" size="mini" @click="countSell">查看各省销售概况</el-button>
          </el-form-item>
          <el-form-item>
            <span class="demonstration">请选择时间</span>
            <el-date-picker
              size="mini"
              v-model="formTime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              :default-time="['00:00:00']"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" size="mini" @click="bwtTime(formTime)">搜索</el-button>
          </el-form-item>
        </el-form>
        <!-- <el-drawer
           title="查找时间段内的订单"
           :before-close="handleClose"
           :visible.sync="dialog"
           direction="ltr"
           custom-class="demo-drawer"
           ref="drawer"
         >
           <div class="demo-drawer__content">
             <el-form :model="form">
               <el-form-item label="" :label-width="formLabelWidth">
                 <el-form-item label="请选择日期">
                   <el-date-picker
                     v-model="form.startTime"
                     type="datetime"
                     size="mini"
                     placeholder="选择起始日期"
                     format="yyyy-MM-dd HH:mm:ss"
                     value-format="yyyy-MM-dd HH:mm:ss">
                   </el-date-picker>
                 </el-form-item>
               </el-form-item>
               <el-form-item label="活动区域" :label-width="formLabelWidth">
                 <el-date-picker
                   v-model="form.endTime"
                   type="datetime"
                   size="mini"
                   placeholder="选择结束日期"
                   format="yyyy-MM-dd HH:mm:ss"
                   value-format="yyyy-MM-dd HH:mm:ss">
                 </el-date-picker>
               </el-form-item>
             </el-form>
             <div class="demo-drawer__footer">
               <el-button @click="cancelForm">取 消</el-button>
               <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
             </div>
           </div>
         </el-drawer>-->
      </div>
      <el-table size="mini" border class="showtable"
                :header-cell-style="{'text-align':'center'}"
                :data="tableDataEnd.slice((currentPage-1)* pageSize,currentPage* pageSize)"
                :current-page.sync="currentPage"
                stripe style="width: 100%;" ref="multipleTable">
        <el-table-column align="center" prop="orderNo" label="订单编号">
        </el-table-column>
        <el-table-column align="center" v-if="false" prop="userId" label="用户ID">
        </el-table-column>
        <el-table-column align="center" prop="userName" label="用户">
        </el-table-column>
        <el-table-column align="center" prop="payment" label="总价"></el-table-column>
        <el-table-column align="center" prop="status" label="发货状态">
          <template slot-scope="scope">
            <div v-text="setStatus(scope.row.status)"></div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="paymentStatus" label="支付状态">
          <template slot-scope="scope">
            <div v-text="setSta(scope.row.paymentStatus)"></div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="shipName" label="收件人"></el-table-column>
        <el-table-column align="center" prop="phone" label="联系方式"></el-table-column>
        <el-table-column align="center" v-if="false" prop="province" label="省份"></el-table-column>
        <el-table-column align="center" v-if="false" prop="city" label="城市"></el-table-column>
        <el-table-column v-if="false" align="center" prop="region" label="收货地区"></el-table-column>
        <el-table-column prop="detailAddress" align="center" label="收货地区">
          <template slot-scope="scope">
            <div v-text="scope.row.province + scope.row.city + scope.row.region"></div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column v-if="false" prop="updateTime" align="center" label="更新时间"></el-table-column>
        <el-table-column label="操作" width="150px" fixed="right" align="center">
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
  import {get, post} from '../../common/js/http';
  import baseUrl from '../../common/js/config'

  // 导入自定义的表单组件
  export default {
    data() {
      return {
        formTime: [],
        dialog: false,
        loading: false,
        criteria: {
          userName: '',
          createTime: '',
          province: ''
        },
        arealist: [],
        username: '',
        value1: '',
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
          this.datas = res.data;
          this.totalNum = this.datas.length;
          this.tableDataEnd = this.datas;
        });
        get('/province/all').then(res => {
          this.arealist = res.data;
        });
        /*  axios.get(url + '/order/all').then(res => {
            console.dir(url + '/order/all')
            console.dir(res.data);
            this.datas = res.data;
            this.totalNum = this.datas.length;
            this.tableDataEnd = this.datas;
          });*/
      },
      bwtTime(val) {
        console.dir(val.length)
        if (val.length === 2) {
          let a = val[0];
          let b = val[1];
          get('/order/time',{startTime:a,endTime:b}).then(res=>{
            this.datas = res.data;
            this.totalNum = this.datas.length;
            this.tableDataEnd = this.datas;
          })
        }
      },
      handleClose(done) {
        console.dir(done)
        if (this.loading) {
          return;
        }
        this.$confirm('确定要提交表单吗？')
          .then(_ => {
            this.loading = true;
            this.timer = setTimeout(() => {
              done();
              // 动画关闭需要一定的时间
              setTimeout(() => {
                this.loading = false;
              }, 400);
            }, 2000);
          })
          .catch(_ => {
          });
      },
      cancelForm() {
        this.loading = false;
        this.dialog = false;
        clearTimeout(this.timer);
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
      dySel(val) {
        console.dir(val)
        post('/order/dy', val).then(res => {
          this.datas = res.data;
          this.totalNum = this.datas.length;
          this.tableDataEnd = this.datas;
        })
      },
      countSell() {
        this.$router.push('/trade/countNum');
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
    margin-left: 15%;
  }

  .showtable {
    margin-left: 5px;
  }
</style>
