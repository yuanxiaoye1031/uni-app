<template>
  <view>
    <view class="goods-item">
      
      <!-- 左侧图片盒子 -->
      <view class="goods-item-left">
        <!-- 购物车中的左侧选择框 -->
        <slot name="cartRadio"></slot>
        <image :src="goods.goods_small_logo || defaultImg" class="goods-img" @click.native="gotoDetail(goods)"></image>
      </view>
      
      <!-- 右侧内容盒子 -->
      <view class="goods-item-right">
        <view class="goods-name" @click.native="gotoDetail(goods)">{{goods.goods_name}}</view>
        <view class="good-info-box">
          <view class="goods-price" @click.native="gotoDetail(goods)">￥ {{goods.goods_price | tofixed}}</view>
          <slot name="num-box" ></slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    props:{
      goods:{
        type:Object,
        default:{}
      }
    },
    data(){
      return {
        //默认图片
        defaultImg:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      }
    },
    filters:{
      tofixed(num){
        return Number(num).toFixed(2)
      }
    },
    methods:{
      //跳转到商品详情
      gotoDetail(goods){
        uni.navigateTo({
          url:'/subpackage/goods_detail/goods_detail?goods_id='+goods.goods_id
        })
      },
      
    }
  }
</script>

<style lang="scss">

  .goods-item{
    display: flex;
    padding: 10px 5px;
    border-bottom: 2px solid #f0f0f0;
    background-color: #FFFFFF;
    border-radius: 15px;
   
    
    
    .goods-item-left{
      margin-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .goods-img{
        width: 100px;
        height: 100px;
        display: block;
        
      }
    }
    
    .goods-item-right{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .goods-name{
        font-size: 13px;
      }
      
      .good-info-box{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .goods-price{
          font-size: 16px;
          color: #c00000;
        }
      }
    }
  }
</style>
