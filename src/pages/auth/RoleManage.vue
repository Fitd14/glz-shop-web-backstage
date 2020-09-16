<template>
  <el-card>
    <div slot="header" >
      <span>角色管理</span>
      <el-button style="float: right;" @click="openAddDialog">添加</el-button>
    </div>
    <el-row >
      <el-col>
        <el-table :data="roleDataAll" style="width: 100%">
          <el-table-column prop="code" label="角色code" ></el-table-column>
          <el-table-column prop="name" label="角色名称"></el-table-column>
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

    <el-dialog title="修改角色" :visible.sync="dialogFormModify" center="center">
      <el-form :model="roleData">
        <el-form-item label="code" :label-width="dialogWidth">
          <el-input v-model="roleData.code" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="dialogWidth">
          <el-input v-model="roleData.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormModify = false">取 消</el-button>
        <el-button type="primary" @click="confirmModify">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加角色" :visible.sync="dialogFormAdd" center="center">
      <el-form :model="roleData">
        <el-form-item label="code" :label-width="dialogWidth">
          <el-input v-model="roleData.code" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="dialogWidth">
          <el-input v-model="roleData.name" autocomplete="off"></el-input>
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
  export default {
    data(){
      return {
        roleDataAll:[],
        roleData:{
          id: null,
          code: null,
          name: null
        },
        dialogFormModify: false,
        dialogFormAdd: false,
        dialogWidth:'120px',
        currentRow: null
      }
    },
    created() {
      this.getRoleAll();
    },
    methods: {
      getRoleAll() {
        get("/role/getAll").then(resp => {
          this.roleDataAll = resp.data;
        });
      },
      openModify(index,row){
        this.dialogFormModify =true;
        get("/role/get/"+row.id).then(resp =>{
          this.roleData = resp.data;
        })
      },
      confirmModify(){
        this.dialogFormModify = false;
        put("/role/put",this.roleData).then(resp =>{
          this.getRoleAll();
        })
      },
      confirmAdd(){
        this.dialogFormAdd = false;
        //this.$axios.post("/role/save",this.roleData)
        post("/role/save",this.roleData).then(resp =>{
        })
        this.getRoleAll();
      },
      del(index,row){
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del("/role/"+row.id).then(reps =>{
            this.getRoleAll();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
          this.getRoleAll();
        });
      },
      openAddDialog(){
        this.roleData.id = null;
        this.roleData.name = null;
        this.roleData.code = null;
        this.dialogFormAdd = true;
      },
      linkUserMenu(index,row){
        this.$router.push({name:"RoleMenu",params:{
            roleId:row.id
          }});
      },
    },
    // watch:{
    //   '$route':'getRoleAll'
    // }
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
