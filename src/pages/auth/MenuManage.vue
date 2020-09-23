<template>
  <el-card>
    <div slot="header" >
      <span>权限列表</span>
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
          ref="tree">
        </el-tree>
      </el-col>
    </el-row>

  </el-card>
</template>
<script>
  import {del, get, post, put} from "../../common/js/http";
  import Tree from "element-ui";
  const api = "/menu/";
  export default {
    data(){
      return {
        menuDataAll:[],
        checkedMenuData:[],
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
          disabled(data,node){
            return data.id === node.data.id
          }
        },
        userId: null,
        highlight: true,
        clickNode: false,
      }
    },
    created() {
      this.userId = this.$route.params.userId;
      this.getRoleMenuAll();
      this.getMenuAll();
    },
    methods: {
      getMenuAll() {
        get(api+"getAll").then(resp => {
          this.menuDataAll = resp.data;
        });
      },
      getRoleMenuAll() {
        get("role/menu/getRoleMenu/user/"+this.userId).then(resp => {
          let index = 0
          for(let i = 0;i < resp.data.menuAll.length;i++){
            this.checkedMenuData[index] = resp.data.menuAll[i].id;
            index++;
          }
          this.$refs.tree.setCheckedKeys(this.checkedMenuData);
        });
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
