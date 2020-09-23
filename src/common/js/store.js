import Vuex from 'vuex';
import Vue from "vue";

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    token:'',
    refToken:'',
    menus:[],
  },
  mutations:{
    set_token(state, token, refToken) {
      state.token = token
      state.refToken = refToken
      sessionStorage.token = token
    },
    del_token(state) {
      state.token = ''
      sessionStorage.removeItem('token')
    },
    set_menus(state,menus){
      state.menus = menus;
      //sessionStorage.menus = menus;
    }
  }
})
