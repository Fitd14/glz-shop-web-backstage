// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import Vuetify from 'vuetify'
import config from './common/js/config'
import MyComponent from './components/MyComponent'
import './common/js/http';
import 'vuetify/dist/vuetify.min.css'
import qs from 'qs'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/material.css'
import Axios from "axios";
import ElementUI from "element-ui";
import VueRouter from "vue-router";
import ViewUi from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUi)
import cookie from 'vue-cookie';
import store from "./common/js/store";
import $ from 'jquery';

Vue.use(Vuetify, { theme: config.theme})
Vue.use(MyComponent)
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.prototype.$qs = qs;
Vue.prototype.$axios = Axios;// 将axios添加到 Vue的原型，这样一切vue实例都可以使用该对象
Vue.prototype.$cookie = cookie;
Vue.prototype.$store = store;
Vue.prototype.$ = $;
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
