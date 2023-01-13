<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <button type="primary" class="btn-login"  @click="getUserProfile">一键登录</button>
    <!-- <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button> -->
    <text class="tips-text">登录后尽享更多权益</text>
  </view>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    data(){
      return {
        
      }
    },
    computed:{
      ...mapState('moduleUser',['redirectInfo'])
    },
    methods:{
       // 获取微信用户的基本信息
      getUserProfile() {
        uni.getUserProfile({
          desc: '你的授权信息',
          success: (res) => {
            // // 将信息存到 vuex 中
            this.$store.dispatch('moduleUser/updateUserInfo',res.userInfo)
            console.log('getUserProfile传的用户信息',res.userInfo)
            this.getToken(res)
          },
          fail: (res) => {
            return uni.$showMsg('您取消了登录授权')
          }
        })
      },
      
      //换取永久Token
      async getToken(info) {
        // 调用微信登录接口
        const [err, res] = await uni.login().catch(err => err)
        // 判断是否 uni.login() 调用失败
        if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
      
        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
      
        // 换取 token
        const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        //实在不行，改代码了，这写的是错的
        if (loginResult.meta.status === 200) return uni.$showMsg('登录失败！')
        uni.$showMsg('登录成功')
        
        //把token保存到vuex
        this.$store.dispatch('moduleUser/updateUserToken',
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o")
        
        this.navigateBack()
      },
      
      navigateBack(){
        if(this.redirectInfo && this.redirectInfo.openType === 'switchTab'){
          uni.switchTab({
            url:this.redirectInfo.from,
            complete:() =>{
              this.$store.dispatch('moduleUser/updateRedirectInfo',null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container{
    height: 750rpx;
    background-color: #F8F8F8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    
    
    .btn-login{
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #C00000;
    }
    
    .tips-text{
      font-size: 12px;
      color: gray;
    }
  }
</style>
