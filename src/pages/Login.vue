<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>乐优商城后台管理</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form :model="fromLogin" id="loginFrom">
                  <v-text-field prepend-icon="person" v-model="fromLogin.username" label="用户名" type="text"/>
                  <v-text-field
                    prepend-icon="lock"
                    v-model="fromLogin.password"
                    label="密码"
                    id="password"
                    type="password"
                    >
<!--                    :append-icon="e1 ? 'visibility' : 'visibility_off'"-->
<!--                    :append-icon-cb="() => (e1 = !e1)"-->
<!--                    :type="e1 ? 'text' : 'password'"-->
                 </v-text-field>
                  <el-image :src="src" v-if="valiDateCode" width="140px" height="48px" ></el-image>
                  <v-text-field label="验证码" v-model="fromLogin.captchaCode" id="captchaCode" v-if="valiDateCode" ></v-text-field>
<!--                  <v-img :src="src" v-if="valiDateCode" width="140px" height="48px"></v-img>-->
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="doLogin">登录</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-dialog v-model="dialog" width="300px">
      <v-alert icon="warning" color="error" :value="true">
      用户名和密码不能为空
      </v-alert>
    </v-dialog>
  </v-app>
</template>

<script>
  import {get, post} from "../common/js/http";
  import config from "../common/js/config";
  import menus from "../menu";

  export default {
    data () {
      return {
        fromLogin: {
          username: '',
          password: '',
          captchaId:'',
          captchaCode:'',
        },
        dialog: '',
        src:null,
        valiDateCode:false,
      }
    },
    methods: {
      doLogin() {
        if (!this.fromLogin.username && this.fromLogin.username !== '' || !this.fromLogin.password && this.fromLogin.password !== '') {
            this.dialog = true;
            return false;
        }
        let formData = new FormData();
        formData.append("username",this.fromLogin.username);
        formData.append("password",this.fromLogin.password);
        formData.append("captchaId",this.fromLogin.captchaId);
        formData.append("captchaCode",this.fromLogin.captchaCode);
        post("/auth",formData,{
          headers:{
            'Accept' : '*/*',
            'content-type': 'multipart/form-data',
            //'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyb290IiwiaXNzIjoidmlvc2F5IiwiZXhwIjoxNjAwODQ0MTU5LCJpYXQiOjE1OTk1NDgxNTl9.Q1X_RrVrF3tzcgYWKZWptrJRVE8EmVjOm2enk2p8I8o'
          }
        }).then(resp =>{
          if(resp.code === "200"){
            this.$store.commit('set_token',resp.data.token,resp.data.refToken);
            this.$router.push({path:'/index/dashboard'});
          }else{
            this.isUseCaptcha();
          }
        });
      },
      getCaptcha(){
        get('/auth/captcha').then(resp => {
          this.fromLogin.captchaId = resp.data.captchaId;
          this.src = resp.data.captchaImg;
          this.valiDateCode = true;
        });
      },
      isUseCaptcha(){
        get('/auth/isUseCaptcha',{username:this.fromLogin.username},
          {
            headers:{
            'Accept' : '*/*',
            'content-type': 'multipart/form-data',
          }
        }).then(resp=>{
          if(resp.data){
            this.getCaptcha();
          }
        });
      }
    }
  };
</script>
