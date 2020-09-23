<template>
  <el-card>
    <div slot="header" >
      <span>所有权限</span>
      <el-button style="float: right;" @click="openAddDialog">添加权限菜单</el-button>
      <el-button style="float: right;" @click="openModifyDialog">修改菜单信息</el-button>
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
          @node-click="CurrentOptionNode"
          ref="tree">
        </el-tree>
        <!--:filter-node-method="filterNode"-->
      </el-col>
    </el-row>

    <el-dialog title="修改权限菜单" :visible.sync="dialogFormModify" center="center">
      <el-form :model="menuData">
        <el-form-item label="名称" :label-width="dialogWidth" >
          <el-input v-model="menuData.name" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="权限值" :label-width="dialogWidth">
          <el-input v-model="menuData.value" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="父节点" :label-width="dialogWidth">
          <el-select v-model="menuData.pid" placeholder="请选择" auto-complete="off">
            <el-option key="0" label="顶级节点" value="0"></el-option>
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
        <el-button @click="dialogFormModify = false">取 消</el-button>
        <el-button type="primary" @click="confirmModify">确 定</el-button>
      </div>
    </el-dialog>

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
            <el-radio label="目录" value=0 ></el-radio>
            <el-radio label="菜单" value=1 ></el-radio>
            <el-radio label="按钮" value=2 ></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="uri" :label-width="dialogWidth">
          <el-input v-model="menuData.uri"  auto-complete="off"/>
        </el-form-item>
        <el-form-item label="排序" :label-width="dialogWidth">
          <el-input v-model="menuData.sort"  auto-complete="off"/>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="dialogWidth">
          <el-switch v-model="menuData.status" />
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
        currentNode:'',
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
        let modifyData = this.convertData(this.menuData);
        put(api+"put",modifyData).then(resp =>{
          this.getMenuAll();
          this.reload();
        })
      },
      confirmAdd(){
        this.dialogFormAdd = false;
        let addData = this.convertData(this.menuData);
        post(api+"save",addData).then(resp =>{
          this.getMenuAll();
          this.reload();
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
      },
      CurrentOptionNode(object,node,currentNode){
        this.currentNode = object.id;
      },
      openModifyDialog(){
        get("/menu/"+this.currentNode).then(resp=>{
          this.menuData = resp.data;
          if(this.menuData.status === 1){
            this.menuData.status = true;
          }else{
            this.menuData.status = false;
          }
          switch (this.menuData.type) {
            case 0:
              this.menuData.type = "目录";
              break;
            case 1:
              this.menuData.type = "菜单";
              break;
            case 2:
              this.menuData.type = "按钮";
          }
        })
        this.dialogFormModify = true;
      },
      convertData(data){
        if(data.status === true){
          data.status = 1;
        }else{
          data.status = 0;
        }
        switch (data.type) {
          case "目录":
            data.type = 0;
            break;
          case "菜单":
           data.type = 1;
            break;
          case "按钮":
            data.type = 2;
        }
        return data
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
