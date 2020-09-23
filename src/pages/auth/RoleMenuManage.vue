<template>
  <el-card>
    <div slot="header" >
      <span>权限列表</span>
      <el-button style="float: right;" @click="modifyRoleAuth">更新权限</el-button>
    </div>
    <el-row >
      <el-col>
        <el-tree
          class="filter-tree"
          :data="menuDataAll"
          :props="defaultProps"
          :highlight-current = "highlight"
          :expand-on-click-node = "clickNode"
          show-checkbox
          node-key="id"
          default-expand-all
          @check-change="checkChange"
          ref="tree">
        </el-tree>
      </el-col>
    </el-row>

  </el-card>
</template>
<script>
  import {del, get, post, put} from "../../common/js/http";
  const api = "/menu/";

  export default {
    data(){
      return {
        menuDataAll:[],
        checkedMenuData:[],
        modifyData:{
          menuIds:[],
          roleId:null
        },
        defaultProps:{
          children: 'permissions',
          label:'name',
        },
        highlight: true,
        clickNode: false,
      }
    },
    created() {
      this.modifyData.roleId = this.$route.params.roleId;
      this.getRoleMenuAll();
      this.getMenuAll();
      this.modifyData.menuIds = new Array();
    },
    methods: {
      getMenuAll() {
        get(api+"getAll").then(resp => {
          this.menuDataAll = resp.data;
        });
      },
      getRoleMenuAll() {
        get("role/menu/getRoleMenu/role/"+this.modifyData.roleId).then(resp => {
          if (resp.data.menuAll !== null){
            for(let i = 0;i < resp.data.menuAll.length;i++){
              this.checkedMenuData[i] = resp.data.menuAll[i].id;
            }
          }
          this.$refs.tree.setCheckedKeys(this.checkedMenuData);
          this.checkedMenuData = resp.data.menuAll;
        });
      },
      modifyRoleAuth(){
        this.$confirm('确认更新吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          put("/role/menu/put",this.modifyData).then(result =>{
            this.getRoleMenuAll();
            this.getMenuAll();
            location.reload();
          })
        }).catch(() => {
        });
      },
      checkChange(data,checked,indeterminate){
        if(checked === true && indeterminate !== true) {
          for (let i = 0; i < this.menuDataAll.length; i++) {
            if (this.modifyData.menuIds[i] === data.id  ) {
              let split = this.modifyData.menuIds.splice(i,1);
              return;
            }
          }
          this.modifyData.menuIds.push(data.id);
        }else{
          for (let i=0;i<this.menuDataAll.length;i++){
            if(this.checkedMenuData[i] === data.id && this.modifyData.menuIds[i] !== data.id){
              this.modifyData.menuIds.push(data.id);
              return;
            }
          }
        }
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
