<template>
  <v-app :dark="dark">
    <!-- 左侧导航条 -->
    <v-navigation-drawer
      :dark="dark"
      persistent
      :mini-variant="miniVariant"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
      width="200px"
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="../assets/2.jpeg">
            </v-list-tile-avatar>
            <v-list-tile-content>
                <el-button type="text" @click="logout">退出登录</el-button>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider/>
      <!-- 左侧菜单 -->
<!--      <v-list class="pt-0" dense>-->
<!--        <v-list-group-->
<!--          v-model="item.value"-->
<!--          v-for="item in items"-->
<!--          :key="item.name"-->
<!--          :prepend-icon="item.icon"-->
<!--          no-action-->
<!--        >-->
<!--          &lt;!&ndash;一级菜单 &ndash;&gt;-->
<!--          <v-list-tile slot="activator">-->
<!--            <v-list-tile-content>-->
<!--              <v-list-tile-title>{{ item.name }}</v-list-tile-title>-->
<!--            </v-list-tile-content>-->
<!--          </v-list-tile>-->
<!--          &lt;!&ndash; 二级菜单 &ndash;&gt;-->
<!--          <v-list-tile v-for="subItem in item.permissions" :key="subItem.name" :to="subItem.uri">-->
<!--            <v-list-tile-content>-->
<!--              <v-list-tile-title>{{ subItem.name }}</v-list-tile-title>-->
<!--            </v-list-tile-content>-->
<!--            <v-list-tile-action>-->
<!--              <v-icon>{{ subItem.icon }}</v-icon>-->
<!--            </v-list-tile-action>-->
<!--          </v-list-tile>-->
<!--        </v-list-group>-->
<!--      </v-list>-->
      <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" unique-opened router>
        <el-submenu v-for="item in items" :index="item.id" :key="item.id">
          <span slot="title" v-text="item.name"></span>
          <el-menu-item-group v-for="subItem in item.permissions" :key="subItem.id">
            <el-menu-item :index="subItem.id" v-text="subItem.name" :route="subItem.uri"></el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </v-navigation-drawer>
    <!-- 顶部工具条 -->
    <v-toolbar
      app
      dark
      :color="dark ? 'secondary' : 'primary'"
    >
      <!-- 隐藏左侧菜单的按钮-->
      <v-toolbar-side-icon @click.stop="drawer = !drawer"/>
      <!-- 收起左侧菜单的按钮-->
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"/>
      </v-btn>
      <!-- 切换黑暗主题 -->
      <v-flex xs1>
        <v-switch
          :label="dark ? '暗黑' : '明亮'"
          v-model="dark"
          color="dark"
          hide-details
        />
      </v-flex>
      <!-- 顶部导航标题 -->
      <v-flex xs3></v-flex>
      <v-toolbar-title v-text="title"/>
      <v-spacer/>

      <!-- 调色板 -->
      <v-btn icon @click.stop="dark = !dark">
        <v-icon>invert_colors</v-icon>
      </v-btn>
      <!-- 顶部导航用户菜单 -->
      <v-btn icon @click.stop="dark = !dark">
        <v-icon>account_box</v-icon>
      </v-btn>
    </v-toolbar>
    <!--中间内容主体-->
    <v-content>
      <v-breadcrumbs>
        <v-icon slot="divider">chevron_right</v-icon>
<!--        <v-breadcrumbs-item>{{item1}}</v-breadcrumbs-item>-->
<!--        <v-breadcrumbs-item>{{item2}}</v-breadcrumbs-item>-->
      </v-breadcrumbs>
      <div>
        <!--定义一个路由锚点，Layout的子组件内容将在这里展示-->
        <router-view/>
      </div>
    </v-content>
  </v-app>
</template>

<script>
  import {get} from "../common/js/http";

  export default {
    data() {
      return {
        dark: false,// 是否暗黑主题
        drawer: true,// 左侧导航是否隐藏
        miniVariant: false,// 左侧导航是否收起
        title: '高老庄商城后台管理',// 顶部导航条名称,
        menuMap: {},
        userMenus:{}
      }
    },
    computed: {
      items() {
        return this.userMenus;
      },
    },
    name: 'App',
    watch: {},
    created() {
      get("/menu/getUserMenu").then(resp =>{
        this.userMenus = resp.data;
      })
    },
    methods: {
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
      },
      logout(){
        get('/logout');
        this.$router.push('/login');
      }
    }
  }
</script>

<style scoped>
  .box {
    width: 90%;
  }
</style>
