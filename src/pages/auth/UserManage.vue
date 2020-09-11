<template>
  <el-card>
    <div slot="header" >
      <span>人员管理</span>
      <el-button style="float: right;" @click="openAddDialog">添加</el-button>
    </div>
    <el-row >
      <el-col>
        <el-table :data="userDataAll" style="width: 100%">
          <el-table-column prop="username" label="用户名" ></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="nickname" label="昵称"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column prop="created" label="创建时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle @click="openModify(scope.$index,scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="del(scope.$index,scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="修改信息" :visible.sync="dialogFormModify" center="center">
      <el-form :model="userData">
        <el-form-item label="用户名" :label-width="dialogWidth">
          <el-input v-model="userData.username" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="dialogWidth">
          <el-input v-model="userData.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="dialogWidth">
          <el-input v-model="userData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="dialogWidth">
          <el-input v-model="userData.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="dialogWidth">
          <el-switch v-model="userData.status" active-text="禁用账户" inactive-text="启用账户" active-color="#ff4949" inactive-color="#13ce66"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormModify = false">取 消</el-button>
        <el-button type="primary" @click="confirmModify">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加账户" :visible.sync="dialogFormAdd" center="center">
      <el-form :model="userData">
        <el-form-item label="用户名" :label-width="dialogWidth">
          <el-input v-model="userData.username" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="dialogWidth">
          <el-input type="password" v-model="userData.password" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="dialogWidth">
          <el-input v-model="userData.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="dialogWidth">
          <el-input v-model="userData.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="dialogWidth">
          <el-input v-model="userData.nickname" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAdd = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>


<script>
  import {del, post, put, get} from "../../common/js/http";
  const api = '/user/';
  export default {

    data(){
      return {
        userDataAll:[],
        userData:{
          id: null,
          username:null,
          phone:null,
          email: null,
          nickname: null,
          status: null,
          created: null
        },
        dialogFormModify: false,
        dialogFormAdd: false,
        dialogWidth: '120px',
      }
    },
    created() {
      this.getUserAll();
    },
    methods: {
      getUserAll() {
        get(api+"all").then(resp => {
          console.log(resp);
          console.log(resp.data[0].id);
          this.userDataAll = resp.data;
        });
      },
      openModify(index,row){
        this.dialogFormModify = true;
        get(api+row.id).then(resp =>{
          this.userData = resp.data;
        })
      },
      confirmModify(){
        this.dialogFormModify = false;
        if(this.userData.status === false){
          this.userData.status = 1;
        }else{
          this.userData.status = 0;
        }
        put(api+"put",this.userData).then(resp =>{
          this.getUserAll();
        })
      },
      confirmAdd(){
        this.dialogFormAdd = false;
        post(api+"save",this.userData).then(resp =>{
        })
        this.getUserAll();
      },
      del(index,row){
        this.$confirm('是否删除该账户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(api+row.id).then(reps =>{
            this.getRoleAll();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
          this.getUserAll();
        });
      },
      openAddDialog(){
        this.dialogFormAdd = true;
      }
    },
  }
</script>

<style scoped>
  .el-row{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  .el-main{
    background-color: #FFFFFF;
  }
</style>
