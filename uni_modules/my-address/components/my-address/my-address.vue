<template>
  <view>
    <!-- 选择收货地址的盒子 -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
    </view>

    <!-- 收货信息的盒子 -->
    <view class="address-info-box" v-else @click="chooseAddress">
      <view class="row0">{{fuzzyAddr}}</view>
      <view class="row1">
        <view class="row1-left">{{address.detailInfoNew}}</view>
        <view class="row1-right">
          <uni-icons type="arrowright" size="18"></uni-icons>
        </view>
      </view>

      <view class="row2">
        <view class="username">{{address.userName}}</view>
        <view class="phone">{{address.telNumber | formatTelNumber}}</view>
      </view>
    </view>

    <!-- 底部边框线 -->
    <image src="/static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>


<script>
  import {mapState,mapGetters} from 'vuex'
  
  export default {
    data() {
      return {
        
      }
    },
    computed:{
      ...mapGetters('moduleUser',['fuzzyAddr']),
      ...mapState('moduleUser',['address'])
    },
    methods: {
      async chooseAddress() {
        console.log('开始选地址')
        const [err , succ] = await uni.chooseAddress().catch(err => err)
        if(err===null && succ.errMsg==='chooseAddress:ok'){
          this.$store.dispatch('moduleUser/updateAddress',succ)
        }
      }
    },
    filters:{
      formatTelNumber(tel){
        let before = tel.slice(0,3)
        let after = tel.slice(7,11)
        return before + '****' + after
      }
    }
  }
</script>


<style lang="scss">
  .address-border {
    display: block;
    width: 100%;
    height: 5px;
    opacity: 60%;
  }

  .address-choose-box {
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .address-info-box {
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 10px;
    
    .row0{
      font-size:12px ;
    }

    .row1 {
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .row2 {
      display: flex;
      align-items: center;

      .username {
        font-size: 15px;
        font-weight: 500;
        margin-right: 10px;
      }

      .phone {
        font-size: 15px;
        color: grey;
      }
    }
  }
</style>
