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
    <view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import {mapGetters,mapState} from 'vuex'
  export default {
    data(){
      return {
        seconds:3,
        timer:null
      }
    },
    computed:{
      ...mapGetters('moduleCart',['checkedCount','total','checkedGoodsPrice']),
      isAllChecked(){
        return this.total===this.checkedCount && this.total!==0
      },
      ...mapState('moduleUser',['address','token']),
      ...mapState('moduleCart',['cart'])
    },
    methods:{
      updateAllGoodsState(){
       this.$store.dispatch('moduleCart/updateAllGoodsState',!this.isAllChecked)
      },
      //用户点击结算按钮
      settlement(){
        if(!this.checkedCount) return uni.$showMsg('请选择要结算的商品')
        
        
        if(JSON.stringify(this.address)==='{}') return uni.$showMsg('请选择收货地址')
        
        if(!this.token) return this.delayNavigate()
        
        this.payOrder()
        
      },
      // 展示倒计时的提示消息
      showTips(n) {
        // 调用 uni.showToast() 方法，展示提示消息
        uni.showToast({
          // 不展示任何图标
          icon: 'none',
          // 提示的消息
          title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
          // 为页面添加透明遮罩，防止点击穿透
          mask: true,
          // 1.5 秒后自动消失
          duration: 1500
        })
      },
      //延时导航到登录页
      delayNavigate(){
        this.showTips(this.seconds)
        this.timer = setInterval(()=>{
          this.seconds--
          if(this.seconds<=0){
            clearInterval(this.timer)
            uni.switchTab({
              url:'/pages/my/my',
              success:(res)=>{
                this.$store.dispatch('moduleUser/updateRedirectInfo',
                {
                  openType:'switchTab',
                  from:'/pages/cart/cart'
                })
              }
            })
            return
          }
          this.showTips(this.seconds)
        },1000)
        
        
      },
      
      //支付
      async payOrder(){
        //创建订单
        
        //创建订单信息对象
        const orderInfo={
          // order_price:this.checkedGoodsPrice,
          order_price:0.01,
          consignee_addr:this.address,
          goods:this.cart.filter(x => x.goods_state).map(x =>({
            goods_id:x.goods_id,
            goods_number:x.goods_count,
            goods_price:x.goods_price
          }))
        }
        
        //发起请求创建订单
        const {data:res} = await uni.$http.post('/api/public/v1/my/orders/create',orderInfo)
        console.log('res',res)
        if(res.meta.status!==200) return uni.$showMsg('订单创建失败！')
        
        //得到服务器响应的订单编号
        const orderNumber=res.message.order_number
        console.log('订单号',orderNumber)
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
