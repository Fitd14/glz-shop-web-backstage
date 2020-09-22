<template>
  <el-card>
    <div slot="header" >
      <span>权限控制</span>
      <el-button style="float: right;" @click="openAddDialog">添加账户权限</el-button>
      <el-button style="float: right;" @click="linkAllMenu">查看所有权限</el-button>
    </div>
    <el-row >
      <el-col>
        <el-table :data="AuthDataAll" style="width: 100%">
          <el-table-column prop="userId.username" label="人员名称" ></el-table-column>
          <el-table-column prop="roleId.name" label="角色名称"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle @click="openModify(scope.$index,scope.row)"></el-button>
              <el-button type="primary" icon="el-icon-setting" circle @click="linkUserMenu(scope.$index,scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="del(scope.$index,scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog title="修改账户角色" :visible.sync="dialogFormModify"  width="30%" center="center">
      <el-form :model="roleUserData">
        <el-form-item label="人员名称" :label-width="dialogWidth" >
          <el-select v-model="roleUserData.userId" placeholder="请选择" auto-complete="off">
            <el-option v-for="item in UserDataAll" :key="item.id" :label="item.username" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" :label-width="dialogWidth">
          <el-select v-model="roleUserData.roleId" placeholder="请选择" auto-complete="off">
            <el-option v-for="roleItem in RoleDataAll" :key="roleItem.id" :label="roleItem.name" :value="roleItem.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormModify = false">取 消</el-button>
        <el-button type="primary" @click="confirmModify">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加账户权限" :visible.sync="dialogFormAdd"  width="30%" center="center">
      <el-form :model="roleUserData">
        <el-form-item label="人员名称" :label-width="dialogWidth" >
          <el-select v-model="roleUserData.userId" placeholder="请选择" auto-complete="off">
            <el-option v-for="item in UserDataAll" :key="item.id" :label="item.username" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" :label-width="dialogWidth">
          <el-select v-model="roleUserData.roleId" placeholder="请选择" auto-complete="off">
            <el-option v-for="roleItem in RoleDataAll" :key="roleItem.id" :label="roleItem.name" :value="roleItem.id"></el-option>
          </el-select>
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
  import {del, get, post, put} from "../../common/js/http";
  const api = "/role/";
  export default {
    data(){
      return {
        AuthDataAll:[],
        roleUserData:{
          roleId:null,
          userId:null
        },
        UserDataAll:[],
        RoleDataAll:[],
        dialogFormModify: false,
        dialogFormAdd: false,
        dialogWidth:'120px',
        currentRow: null
      }
    },
    created() {
      this.getRoleAuthAll();
    },
    methods: {
      getRoleAuthAll() {
        get(api+"user/getAll").then(resp => {
          this.AuthDataAll = resp.data;
        });
      },
      openModify(index,row){
        this.dialogFormModify =true;
        this.getRoleAndUser();
        get(api+"user/get?roleId="+row.roleId.id+"&userId="+row.userId.id).then(resp =>{
          this.roleUserData = resp.data;
        })
      },
      confirmModify(){
        this.dialogFormModify = false;
        put(api+"user/put",this.roleUserData).then(resp =>{
          this.getRoleAuthAll();
        })
      },
      confirmAdd(){
        this.dialogFormAdd = false;
        console.log(this.roleUserData.roleId);
        console.log(this.roleUserData.userId);
        post(api+"user/save",this.roleUserData).then(resp =>{
          this.getRoleAuthAll();
        })
      },
      del(index,row){
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(api+"user/"+row.roleId.id+"/"+row.userId.id).then(reps =>{
            this.getRoleAuthAll();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
          this.getRoleAuthAll();
        });
      },
      openAddDialog(){
        this.roleUserData.userId = null;
        this.roleUserData.roleId = null;
        this.getRoleAndUser();
        this.dialogFormAdd = true;
      },
      getRoleAndUser(){
        get("/user/all").then(result => {
          this.UserDataAll = result.data;
        })
        get(api+"getAll").then(result =>{
          this.RoleDataAll = result.data;
        })
      },
      linkAllMenu(){
        this.$router.push("AllAuth");
      },
      linkUserMenu(index,row){
        console.log(row);
        this.$router.push({name:"Menu",params:{
          userId:row.userId.id
        }});
      },
    }
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
