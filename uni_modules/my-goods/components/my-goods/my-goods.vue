<template>
  <view>
    <view class="goods-item">
      <!-- 左侧图片盒子 -->
          <view class="goods-item-left">
            <image :src="goods.goods_small_logo || defaultImg" class="goods-img"></image>
          </view>
          
          <!-- 右侧内容盒子 -->
          <view class="goods-item-right">
            <view class="goods-name">{{goods.goods_name}}</view>
            <view class="good-info-box">
              <view class="goods-price">￥ {{goods.goods_price | tofixed}}</view>
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
    }
  }
</script>

<style lang="scss">
  .goods-item{
    display: flex;
    padding: 10px 5px;
    border-bottom: 2px solid #f0f0f0;
    
    
    .goods-item-left{
      margin-right: 5px;
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
        
        .goods-price{
          font-size: 16px;
          color: #c00000;
        }
      }
    }
  }
</style>
