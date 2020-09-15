import Vue from 'vue'
import Router from 'vue-router'
import GoodsForm from "../pages/item/GoodsForm";


Vue.use(Router)

function route (path, file, name, children) {
  return {
    exact: true,
    path,
    name,
    children,
    component: () => import('../pages' + file)
  }
}

export default new Router({
  routes: [
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
        route("/item/specification",'/item/specification/Specification',"Specification"),
        route("/item/specGroup",'/item/specification/SpecGroup',"SpecGroup"),
        route("/item/specParam",'/item/specification/SpecParam',"SpecParam"),
        route("/user/statistics",'/item/Statistics',"Statistics"),
        route("/trade/promotion",'/trade/Promotion',"Promotion"),
        route("/auth/manage","/auth/AuthManage","Manage"),
        route("/auth/role","/auth/RoleManage","Role"),
        route("/auth/user","/auth/UserManage","user"),
        route("/item/goodsForm",'/item/GoodsForm',"GoodsForm"),
        route("/item/editGoodsForm/:editId",'/item/EditGoodsForm',"EditGoodsForm"),
        route("/item/checkGoodsForm/:checkId",'/item/CheckGoodsForm',"CheckGoodsForm"),
      ]
    }
  ]
})
