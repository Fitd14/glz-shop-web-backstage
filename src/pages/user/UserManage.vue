<template>
  <el-card>
    <div slot="header" class="header">
      <el-row>
        <el-col span="4">
          <span style="margin-top: 10px;display: inline-flex">会员管理</span>
        </el-col>
        <el-col span="4" offset="16">
          <el-input v-model="search" placeholder="输入关键字查找" size="mini" ></el-input>
        </el-col>
      </el-row>
    </div>
    <el-row >
      <el-col>
        <el-table :data="member.filter(data => !search || data.username.toLowerCase().includes(search.toLowerCase()))" style="width: 100%" >
          <el-table-column prop="username" label="用户名称" ></el-table-column>
          <el-table-column prop="nickname" label="用户昵称" ></el-table-column>
          <el-table-column prop="phone" label="手机号"></el-table-column>
          <el-table-column prop="gender" label="性别">
            <template slot-scope="scope">
                <p v-text="genderChange(scope.row,scope.row.gender,scope.$index)"></p>
            </template>
          </el-table-column>
          <el-table-column prop="birthday" label="生日"></el-table-column>
          <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle @click="openModify(scope.$index,scope.row)"></el-button>
              <el-button type="primary" icon="el-icon-setting" circle @click="linkUserMenu(scope.$index,scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="del(scope.$index,scope.row)"></el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-col>
    </el-row>

    <!-- <el-dialog title="修改账户角色" :visible.sync="dialogFormModify"  width="30%" center="center">
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
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
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
    </el-dialog> -->
  </el-card>
</template>
<script>
  import {del, get, post, put} from "../../common/js/http";
  export default {
    data(){
      return {
        member:[],
        dialogFormModify: false,
        dialogFormAdd: false,
        dialogWidth:'120px',
        currentRow: null,
        search:'',
      }
    },
    created() {
      this.getRoleAuthAll();
    },
    methods: {
      getRoleAuthAll() {
        get("/user/member/getAll").then(resp => {
          this.member = resp.data;
          // console.log("member="+this.member);
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
        })
        this.getRoleAuthAll();
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
      genderChange(row,data,index){
        if(data === 0){
          return '男'
        }else if(data === 1){
          return '女'
        }else{
          return '未知'
        }
      },
      searchMember(){
        get("/user/member/info/"+this.searchUsername).then(resp=>{
          this.member = resp.data;
        })
        console.log(this.member);
      }
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
  .header span{
    margin-top: 10px;
  }
</style>
