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
                <v-form :model="fromLogin">
                  <v-text-field prepend-icon="person" v-model="fromLogin.username" label="用户名" type="text"/>
                  <v-text-field
                    prepend-icon="lock"
                    v-model="fromLogin.password"
                    label="密码"
                    id="password" >
<!--                    :append-icon="e1 ? 'visibility' : 'visibility_off'"-->
<!--                    :append-icon-cb="() => (e1 = !e1)"-->
<!--                    :type="e1 ? 'text' : 'password'"-->
                 </v-text-field>
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
  export default {
    data () {
      return {
        fromLogin: {
          username: '',
          password: ''
        },
        dialog: ''
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
        this.$axios.post("/auth",formData,{
          headers:{
            'Accept' : '*/*',
            'content-type': 'multipart/form-data',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyb290IiwiaXNzIjoidmlvc2F5IiwiZXhwIjoxNjAwODQ0MTU5LCJpYXQiOjE1OTk1NDgxNTl9.Q1X_RrVrF3tzcgYWKZWptrJRVE8EmVjOm2enk2p8I8o'
          }
        }).then(resp =>{
          if(resp.code == "200"){
            this.$router.push({path:'/index/dashboard'})
          }
        });
      },
    }
  };
</script>
