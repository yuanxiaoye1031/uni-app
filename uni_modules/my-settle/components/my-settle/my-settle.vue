<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="updateAllGoodsState">
      <radio :checked="isAllChecked" color="#C00000" /><text>全选</text>
    </label>
    
    <!-- 合计 -->
    <view class="amount-box">
      合计：<text class="amount">￥ {{checkedGoodsPrice}}</text>
    </view>
    
    <!-- 结算按钮 -->
    <view class="btn-settle">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data(){
      return {
        
      }
    },
    computed:{
      ...mapGetters('moduleCart',['checkedCount','total','checkedGoodsPrice']),
      isAllChecked(){
        return this.total===this.checkedCount && this.total!==0
      }
    },
    methods:{
      updateAllGoodsState(){
       this.$store.dispatch('moduleCart/updateAllGoodsState',!this.isAllChecked)
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container{
    bottom: 0;
    left: 0;
    position: fixed;
    height: 50px;
    width: 100%;
    background-color: white;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    .radio{
      display: flex;
      align-items: center;
    }
    
    .amount-box{
      .amount{
        color: #C00000;
        font-weight: bold;
      }
    }
    
    .btn-settle{
      background-color: #C00000;
      height: 50px;
      color: white;
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;
    }
  }
</style>
