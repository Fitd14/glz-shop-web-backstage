<template>
    <router-view v-if="isRouterAlive"></router-view>
</template>

<script>
export default {
  name:"App",
  data(){
    return{
      isRouterAlive : true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    }
  },
  provide() {
    return {
      reload: this.reload
    };
  }
}
</script>
