<template>
  <view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(img,index) in goods_info.pics" :key="pics_id">
        <image :src="img.pics_big" @click="preview(index)"></image>
      </swiper-item>
    </swiper>
    
    <!-- 商品信息区域 -->
    <view class="goods-info-box" v-show="goods_info.length!==0">
      <!-- 商品价格 -->
      <view class="price" >￥ {{goods_info.goods_price}}</view>
      
      <!-- 商品信息主体区域 -->
      <view class="goods-info-body">
        
        <!-- 左侧 ，商品名字 -->
        <view class="goods-name">{{goods_info.goods_name}}</view>
        
        <!-- 右侧，收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
        
      </view>
      
      <!-- 运费 -->
      <view class="express">快递：免运费</view>
      
    </view>
    
    <!-- 商品详情介绍 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    
    <!-- 商品导航组件区域 -->
    <view class="goods_nav">
      <!-- fill 控制右侧按钮的样式 -->
      <!-- options 左侧按钮的配置项 -->
      <!-- buttonGroup 右侧按钮的配置项 -->
      <!-- click 左侧按钮的点击事件处理函数 -->
      <!-- buttonClick 右侧按钮的点击事件处理函数 -->
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onclick" @buttonClick="buttonClick"></uni-goods-nav>
    </view>
    
  </view>
</template>

<script>
  import {mapState,mapGetters} from 'vuex'
  export default {
    data() {
      return {
        goods_info:[],
        options: [{
              icon: 'shop',
              text: '店铺'
            }, {
              icon: 'cart',
              text: '购物车',
              info: 0
            }],
            // 右侧按钮组的配置对象
            buttonGroup: [{
                text: '加入购物车',
                backgroundColor: '#ff0000',
                color: '#fff'
              },
              {
                text: '立即购买',
                backgroundColor: '#ffa200',
                color: '#fff'
              }
            ]
      };
    },
    computed:{
      ...mapState('moduleCart',['cart']),
      ...mapGetters('moduleCart',['total'])
    },
    watch:{
      total:{
        immediate:true,
        
        handler(newVal){
          const findResult = this.options.find(x => x.text==='购物车')
          if(findResult){
            findResult.info=newVal
          }
        }
      }
    },
    onLoad(options) {
      const goods_id=options.goods_id
      this.getGoodsDetail(goods_id)
    },
    methods:{
      
      //获取商品详情信息
      async getGoodsDetail(id){
        const {data : res} = await uni.$http.get('/api/public/v1/goods/detail',{goods_id:id})
        if(res.meta.status!==200) return uni.$showMsg()
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg')
       // res.message.pics.forEach((pic)=>{
       //   pic.pics_big.replace(/http/g,'https')
       // })
        this.goods_info=res.message
      },
      
      //预览大图
      preview(index){
        uni.previewImage({
          current:index,
          urls:this.goods_info.pics.map(x => x.pics_big),
        })
      },
      
      //点击购物车跳转到购物车页面
      onclick(event){
        if(event.content.text=='购物车'){
          uni.switchTab({
            url:'/pages/cart/cart'
          })
        }
      },
      
      //点击加入购物车或购买
      buttonClick(event){
        if(event.content.text==='加入购物车'){
          const goods={
            goods_id:this.goods_info.goods_id,
            goods_name:this.goods_info.goods_name,
            goods_count:1,
            goods_small_logo:this.goods_info.goods_small_logo,
            goods_state:true ,
            goods_price:this.goods_info.goods_price
          }
          this.$store.dispatch('moduleCart/addToCart',goods)
          uni.$showMsg('添加成功！')
        }
        else if(event.content.text==='立即购买'){
          
        }
      }
    }
}
</script>

<style lang="scss">
swiper{
  height: 750rpx;
  image{
    width: 100%;
    height: 100%;
  }
}

.goods-info-box{
  padding: 10px;
  .price{
    color: #C00000;
    font-size: 18px;
    margin: 10px 0;
    margin-right: 0;
  }
  
  .goods-info-body{
    display: flex;
    justify-content: space-between;
    .goods-name{
      font-size: 13px;
      margin-right: 10px;
    }
    
    .favi{
      width: 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-left: 1px solid #efefef;
      color:gray
    }
  }
  
  .express{
    font-size: 12px;
    color: gray;
    margin: 10px 0;
  }
}

.goods-detail-container {
  // 给页面外层的容器，添加 50px 的内padding，
  // 防止页面内容被底部的商品导航组件遮盖
  padding-bottom: 50px;
}

.goods_nav {
  // 为商品导航组件添加固定定位
  position:sticky;
  bottom: 0;
  left: 0;
  width: 100%;
}

</style>
