<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="groups"
      hide-actions
      class="elevation-0"
    >
      <template slot="items" slot-scope="props">
        <tr @click="selectGroup(props.item)">
          <td class="text-xs-center">{{ props.item.id }}</td>
          <td class="text-xs-center">{{ props.item.name }}</td>
          <td class="text-xs-center">{{ props.item.keywords }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon @click="editGroup(props.item)">
              <i class="el-icon-edit"/>
            </v-btn>
            <v-btn icon @click="deleteGroup(props.item.id)">
              <i class="el-icon-delete"/>
            </v-btn>
            <v-btn icon @click="selSubClass(props.item)" v-if="props.item.parentId ===0">
              子类
            </v-btn>
            <v-btn icon v-else @click="rollback()">返回</v-btn>
          </td>
        </tr>
      </template>
      <template slot="no-data">
        该分类下暂无规格组或尚未选择分类
      </template>
    </v-data-table>

    <v-btn color='primary' @click="addGroup" v-if="subclass == true">新增分组</v-btn>
    <v-btn color='primary' @click="rollback()" v-if="subclass==false">返回上级</v-btn>
    <v-dialog v-model="show" width="300" height="200">
      <v-card>
        <v-card-title>{{isEdit ? '修改' : '新增'}}分组</v-card-title>
        <v-card-text  v-if="isEdit==false">
          <el-select
            v-model="group.parentId"
            filterable
            remote
            placeholder="请选择商品類型"
          >
            <el-option
              v-for="item in groups"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <v-text-field label="分组名称：" v-model="group.name"/>
          <v-text-field label="关键字：" v-model="group.keywords"/>
        </v-card-text>
        <v-card-text  v-else>
          <v-input v-model="group.id" hidden></v-input>
          <v-input v-model="group.parentId" label="父类别：" disabled>{{group.parentId}}</v-input>
          <v-text-field label="分组名称：" v-model="group.name"/>
          <v-text-field label="关键字：" v-model="group.keywords"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="blue darken-1" flat @click.native="show=false">取消</v-btn>
          <v-btn v-if="isEdit==false" color="blue darken-1" flat @click="save(group)">保存</v-btn>
          <v-btn v-else color="blue darken-1" flat @click="edit(group)">更新</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {get, post} from "../../../common/js/http";
  export default {
    name: "spec-group",
    props: {
      id: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        subclass: true,
        groups: [],
        loading: true, // 是否在加载中
        headers: [
          {text: "id", value: "id", align: "center", sortable: false},
          {text: "组名", value: "name", align: "center", sortable: false},
          {text: "关键字", value: "keywords", align: "center", sortable: false},
          {text: "操作", align: "center", sortable: false}
        ],
        show: false, // 是否打开编辑窗口
        group: {
          id:'',
          name: '',
          level:'',
          navStatus:'',
          showStatus:'',
          keywords:'',
          parentId:'',
          children:'',
        },
        isEdit: false, // 是否是编辑
      };
    },
    mounted() { // 渲染后执行
      this.seltype();
    },
    watch: {
      id() {
        this.loadData();
      }
    },

    methods: {
      seltype() {
        //查询数据
        get("/commodityCategory/selByParentId/0").then(res=>{
          this.groups = res.data;
          // 完成赋值后，把加载状态赋值为false
          this.loading = false;
        });
      },
      rollback() {
        this.subclass = true;
        get("/commodityCategory/selByParentId/"+0).then(res =>{
          this.groups = res.data;
          console.dir(this.type);
          // 完成赋值后，把加载状态赋值为false
          this.loading = false;
        }).catch(err=>{
          console.dir(err);
        })
      },
      loadData() {
        get("/commodityCategory/selByParentId/0")
          .then(({data}) => {
            this.groups = data;
            // 完成赋值后，把加载状态赋值为false
            this.loading = false;
          })
          .catch(() => {
            this.groups = [];
          })
      },
      editGroup(pojo) {
        this.isEdit=true;
        this.show = true;
        get('/commodityCategory/selById?id=' + pojo.id).then(res =>{
          // console.log(res.data.parentId);
          //   if(res.data.parentId === 0 ){
          //   }else {
          //     get('/commodityCategory/selByParentId/'+res.data.parentId).then(result=>{
          //       console.log(result.data);
          //        res.data.parentId = result.data.name;
          //        console.log(res.data.parentId);
          //     });
          //   }
          //   console.log(res.data.parentId);
            this.group = res.data;
            console.log(this.group);
        });
        // post("/commodityCategory/update",this.group);
      },
      addGroup() {
        this.group = {
          id:'',
          name: '',
          level:'',
          navStatus:'',
          showStatus:'',
          keywords:'',
          parentId:'',
          children:'',
        };
        this.show = true;
        this.isEdit = false;
      },
      edit(pojo){
        console.log(pojo);
        post('/commodityCategory/update',pojo).then(()=>{
          this.isEdit=false;
          this.show=false;
          this.$Message.success("更新成功");
          this.loadData();
        }).catch(err=>{
          this.$confirm(err);
        });
      },
      save(pojo) {
        if (pojo.parentId == ''){
            pojo.parentId = 0;
           post('/commodityCategory/add', pojo).then(()=>{
             this.show=false;
             this.loadData();
           });
        }else {
           post('/commodityCategory/add', pojo).then((reset) => {
              console.log(reset.data);
             // post('/commodityCategory/updateByParentId/'+pojo.parentId+"/"+pojo.name).then(()=>{
               // 关闭窗口
               this.show = false;
               this.$message.success("保存成功！");
               this.loadData();
           }).catch(() => {
             this.$message.error("保存失败！");
           });
           }
      },
      deleteGroup(id) {
        console.log(id);
        this.$confirm('此操作将永久删除该商品, 是否继续?').then(()=>{
           get("/commodityCategory/del/" + id).then(() => {
            this.$message.success("删除成功");
            this.loadData();
          }).catch(()=>{
            this.$confirm("删除失败");
        })
        });
      },

      selSubClass(pojo) {
        this.subclass = false;
        if (pojo.children==null){
          // 完成赋值后，把加载状态赋值为false
          this.groups = [];
          this.loading = true;
        }else {
          get("/commodityCategory/selByParentId/" + pojo.id)
            .then((res) => {
              this.groups = res.data;
              // 完成赋值后，把加载状态赋值为false
              this.loading = false;
            });
        }
      },
      selectGroup(group) {
         this.$emit("select", group);
      }
    }
  };
</script>
