<template>
  <el-card>
    <div slot="header" >
      <span>所有权限</span>
      <el-button style="float: right;" @click="openAddDialog">添加权限菜单</el-button>
    </div>
    <el-row >
      <el-col>
        <el-tree
          class="filter-tree"
          :data="menuDataAll"
          :props="defaultProps"
          :highlight-current = "highlight"
          :expand-on-click-node = "clickNode"
          default-expand-all
          ref="tree">
        </el-tree>
        <!--:filter-node-method="filterNode"-->
      </el-col>
    </el-row>

    <!--    <el-dialog title="修改权限菜单" :visible.sync="dialogFormModify" center="center">-->
    <!--      <el-form :model="roleUserData">-->
    <!--        <el-form-item label="code" :label-width="dialogWidth">-->
    <!--          <el-input v-model="roleUserData.userId" autocomplete="off" ></el-input>-->
    <!--        </el-form-item>-->
    <!--        <el-form-item label="角色" :label-width="dialogWidth">-->
    <!--          <el-input v-model="roleUserData.roleId" autocomplete="off"></el-input>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <div slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="dialogFormModify = false">取 消</el-button>-->
    <!--        <el-button type="primary" @click="confirmModify">确 定</el-button>-->
    <!--      </div>-->
    <!--    </el-dialog>-->

    <el-dialog title="添加权限菜单" :visible.sync="dialogFormAdd" center="center">
      <el-form :model="menuData">
        <el-form-item label="名称" :label-width="dialogWidth" >
          <el-input v-model="menuData.name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="权限值" :label-width="dialogWidth">
          <el-input v-model="menuData.value" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="父节点" :label-width="dialogWidth">
          <el-select v-model="menuData.pid" placeholder="请选择" auto-complete="off">
            <el-option v-for="roleItem in menuDataAll" :key="roleItem.id" :label="roleItem.name" :value="roleItem.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图标" :label-width="dialogWidth">
          <el-input v-model="menuData.icon" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="类型" :label-width="dialogWidth">
          <el-radio-group v-model="menuData.type">
            <el-radio label="目录" value="0"></el-radio>
            <el-radio label="菜单" value="1"></el-radio>
            <el-radio label="按钮" value="2"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="uri" :label-width="dialogWidth">
          <el-input v-model="menuData.uri"  auto-complete="off"/>
        </el-form-item>
        <el-form-item label="排序" :label-width="dialogWidth">
          <el-input v-model="menuData.sort"  auto-complete="off"/>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="dialogWidth">
          <el-switch v-model="menuData.status"/>
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

  const api = "/menu/";
  export default {
    data(){
      return {
        menuDataAll:[],
        menuData:{
          id: null,
          pid: null,
          name: null,
          icon: null,
          value: null,
          uri: null,
          status: null,
          type: null,
          sort: null,
        },
        defaultProps:{
          children: 'permissions',
          label:'name',
        },
        highlight: true,
        clickNode: false,
        dialogFormModify: false,
        dialogFormAdd: false,
        dialogWidth:'120px',
        currentRow: null
      }
    },
    created() {
      this.getMenuAll();
    },
    methods: {
      getMenuAll() {
        get(api+"getAll").then(resp => {
          this.menuDataAll = resp.data;
        });
      },
      confirmModify(){
        this.dialogFormModify = false;
        put(api+"put",this.menuData).then(resp =>{
          this.getMenuAll();
        })
      },
      confirmAdd(){
        this.dialogFormAdd = false;
        if(this.menuData.status === true){
          this.menuData.status = 1;
        }else{
          this.menuData.status = 0;
        }
        switch (this.menuData.type) {
          case "目录":
            this.menuData.type = 0;
            break;
          case "菜单":
            this.menuData.type = 1;
            break;
          case "按钮":
            this.menuData.type = 2;
        }
        console.log(this.menuData);
        post(api+"save",this.menuData).then(resp =>{
          this.getMenuAll();
        })
      },
      del(index,row){
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(api+row.id).then(reps =>{
            this.getMenuAll();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      openAddDialog(){

        get(api+"getAll").then(result =>{
          this.RoleDataAll = result.data;
        })
        this.dialogFormAdd = true;
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
</style>
