<template>
  <view class="box">
    <my-login v-if="!token"></my-login>
    <my-userinfo v-else></my-userinfo>
  </view>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        
      };
    },
    computed:{
      ...mapState('moduleUser',['token']),
    },
  }
</script>

<style lang="scss">
page, .box{
    height: 100%;
  }
</style>
