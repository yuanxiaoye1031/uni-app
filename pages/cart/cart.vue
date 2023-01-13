<template>
  <view class="box" v-if="cart.length!==0">
    
    <!-- 收货地址 -->
    <my-address></my-address>
    
    <!-- 商品列表的标题区 -->
    <view class="cart-title">
      <!-- 左侧图标 -->
      <uni-icons type="shop" size="18"></uni-icons>
      <!-- 描述文本 -->
      <text class="cart-title-text">购物车</text>
    </view>
    
    <!-- 循环渲染购物车中的商品信息 -->
    <uni-swipe-action>
      <block v-for="(good,index) in cart" :key="good.goods_id">
        <uni-swipe-action-item :right-options="options" @click="swiperItenClickHandler(good)">
          <my-goods :goods="good">
            <radio :checked="good.goods_state"  color="#C00000" slot="cartRadio" @click="changeGoodsState(good)"></radio>
            <uni-number-box slot="num-box" :min="1" :value="good.goods_count" @change="updateCart($event,good)"></uni-number-box>
          </my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    
    
    
    <my-settle></my-settle>
  </view>
  
  <view class="empty-cart" v-else>
    <image src="../../static/emptyCart.png" class="empty-img"></image>
    <text class="tip-text">购物车空空如也~</text>
  </view>
  
  
</template>

<script>
  import {mapState,mapGetters} from 'vuex'
  import badegMixin from '@/mixins/tabbsr-badge.js'
  export default {
    mixins:[badegMixin],
    data() {
      return {
        options:[
          {
            text:'删除',
            style:{
              backgroundColor:'#C00000'
            }
          }
        ]
      };
    },
    computed:{
      ...mapState('moduleCart',['cart']),
      ...mapGetters('moduleCart',['total'])
    },
    methods:{
      changeGoodsState(good){
        let index = this.cart.indexOf(good)
        if(index!==-1){
          this.$store.dispatch('moduleCart/changeGoodsState',index)
        }
      },
      
      //跳转到商品详情
      gotoDetail(goods){
        uni.navigateTo({
          url:'/subpackage/goods_detail/goods_detail?goods_id='+goods.goods_id
        })
      },
      
      //购物车商品num框变化
      updateCart(val,good){
        this.$store.dispatch('moduleCart/changeGoodsCount',{
          goods:good,
          val:val
        })
      },
      
      //左滑删除
      swiperItenClickHandler(goods){
        console.log(goods)
        
        this.$store.dispatch('moduleCart/removeGoods',goods)
      }
    }
  }
</script>

<style lang="scss">
*{
  background-color: #FFFFFF;
}

.box{
  padding-bottom: 50px;
}
.cart-title{
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;
  .cart-title-text{
    font-size: 14px;
    margin-left: 10px;
  }
}

.empty-cart{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60%;
  .empty-img{
    width: 120px;
    height: 110px;
  }
  .tip-text{
    font-size: 12px;
    color: gray;
    margin-top: 15px;
  }
}
</style>
