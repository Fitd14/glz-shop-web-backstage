import Vue from 'vue'
import Router from 'vue-router'
import ViewUi from 'view-design';

Vue.use(ViewUi)

Vue.use(Router)

function route(path, file, name, children) {
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
    route("/login", '/Login', "Login"),// /login路径，路由到登录组件
    {
      path: "/", // 根路径，路由到 Layout组件
      component: () => import('../pages/Layout'),
      redirect: "/login",
      children: [ // 其它所有组件都是 Layout的子组件
        route("/index/dashboard", "/Dashboard", "Dashboard"),
        route("/item/category", '/item/Category', "Category"),
        route("/item/brand", '/item/Brand', "Brand"),
        route("/item/list", '/item/Goods', "Goods"),
        route("/item/specification", '/item/specification/Specification', "Specification"),
        route("/user/statistics", '/item/Statistics', "Statistics"),
        route("/trade/statistics", '/trade/Statistics', "Statistics"),
        route("/trade/promotion", '/trade/Promotion', "Promotion"),
        route("/trade/order", '/trade/Order', "Order"),
        route("/trade/orderItem", '/trade/OrderItem', "OrderItem"),
        route("/trade/orderItem/:id", '/trade/OrderItem', "OrderItem"),
        route("/auth/manage", "/auth/AuthManage", "Manage"),
        route("/auth/role", "/auth/RoleManage", "Role"),
        route("/auth/user", "/auth/UserManage", "user")
      ]
    }
  ]
})
