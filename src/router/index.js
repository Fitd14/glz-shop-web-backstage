import Vue from 'vue'
import Router from 'vue-router'
import store from '../common/js/store'

Vue.use(Router)

if (sessionStorage.getItem('token')){
  store.commit('set_token',sessionStorage.getItem('token'));
}

function route (path, file, name, children) {
  return {
    exact: true,
    path,
    name,
    children,
    component: () => import('../pages' + file)
  }
}

const router = new Router({
  mode: 'history',
  routes:[
    route("/login",'/Login',"Login"),// /login路径，路由到登录组件
    {
      path:"/", // 根路径，路由到 Layout组件
      component: () => import('../pages/Layout'),
      redirect:"/login",
      children:[ // 其它所有组件都是 Layout的子组件
        route("/index/dashboard","/Dashboard","Dashboard"),
        route("/item/category",'/item/Category',"Category"),
        route("/item/brand",'/item/Brand',"Brand"),
        route("/item/list",'/item/Goods',"Goods"),
        route("/advertise/adver","/advertise/Adver","Adver"),
        route("/advertise/newProduct","/advertise/NewProduct","NewProduct"),
        route("/item/specification",'/item/specification/Specification',"Specification"),
        route("/item/specGroup",'/item/specification/SpecGroup',"SpecGroup"),
        route("/item/specParam",'/item/specification/SpecParam',"SpecParam"),
        route("/user/statistics",'/item/Statistics',"Statistics"),
        route("/user/UserManage",'/user/UserManage',"User"),
        route("/trade/promotion",'/trade/Promotion',"Promotion"),
        route("/auth/manage","/auth/AuthManage","Manage"),
        route("/auth/role","/auth/RoleManage","Role"),
        route("/auth/user","/auth/UserManage","user"),
        route("/item/goodsForm",'/item/GoodsForm',"GoodsForm"),
        route("/item/editGoodsForm/:editId",'/item/EditGoodsForm',"EditGoodsForm"),
        route("/item/checkGoodsForm/:checkId",'/item/CheckGoodsForm',"CheckGoodsForm"),
        route("/auth/user","/auth/UserManage","user"),
        route("/auth/menu/:userId","/auth/MenuManage","Menu"),
        route("/auth/role_menu/:roleId","/auth/RoleMenuManage","RoleMenu"),
        route("/auth/AllAuth","/auth/allmenu","AllAuth"),
      ]
    }
  ]
});

router.beforeEach((to,from,next) =>{
  if(to.matched.some(r => r.meta.requireAuth)){
    if (store.state.token) {
      next();
    }else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  }else{
    next();
  }
});

export default router;

