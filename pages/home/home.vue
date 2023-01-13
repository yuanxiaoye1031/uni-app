<template>
  <view>
    <view class="serach-box">
      <my-search @click.native="gotoSearch"></my-search>
    </view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="item in swiperList" :key="item.goods_id">
        <navigator class="swiper-item" :url="'/subpackage/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <image :src="item.image_src" mode=""></image>
        </navigator>
      </swiper-item>
    </swiper>
    
    <!-- 分类导航区域 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item,index) in navList" :key="index" @click="navClickHandler(item)">
        <image class="nav-img" :src="item.image_src"></image>
      </view>
    </view>
    
    <!-- 楼层区域 -->
    <view class="floor-list">
      <!-- 每个楼层 -->
      <view class="floor-item" v-for="(floor,index) in floorList" :key="index">
        <!-- 楼层的标题 -->
        <image class="floor-title" :src="floor.floor_title.image_src"></image>
        
        <!-- 楼层的图片区 -->
        <view class="floor-img-box">
          
          <!-- 左侧大图片盒子 -->
          <navigator class="left-img-box" :url="floor.product_list[0].url">
            <image :src="floor.product_list[0].image_src" :style="{width:floor.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
          </navigator>
          
          <!-- 右侧小图片盒子 -->
          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(product,index) in floor.product_list" :key="index" v-if="index!==0" :url="product.url">
              <image :src="product.image_src" :style="{width:product.image_width + 'rpx'}" mode="widthFix"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
 
  </view>
</template>

<script>
  import badegMixin from '@/mixins/tabbsr-badge.js'
  export default {
    mixins:[badegMixin],
    data() {
      return {
        //轮播图数组
        swiperList:[],
        //分类导航的数据列表
        navList:[],
        //楼层数据列表
        floorList:[],
      };
    },
    onLoad() {
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods:{
      //获取轮播图数据
      async getSwiperList(){
         const {data : res} = await uni.$http.get('/api/public/v1/home/swiperdata')
         if(res.meta.status!==200){
           return uni.$showMsg()
         }
         
         this.swiperList=res.message
      },
    
    //获取导航区数据
      async getNavList(){
        const {data : res} = await uni.$http.get('/api/public/v1/home/catitems')
        if(res.meta.status!==200) return uni.$showMsg()
        
        this.navList=res.message
      },
      
      //点击导航区按钮的事件处理函数
      navClickHandler(item){
        if(item.name==='分类'){
          uni.switchTab({
            url:'/pages/cate/cate'
          })
        }
      },
      
      //获取楼层数据
      async getFloorList(){
        const {data : res} = await uni.$http.get('/api/public/v1/home/floordata')
        if(res.meta.status!==200) return uni.$showMsg()
        
        //对数据进行处理
        res.message.forEach(floor => {
          floor.product_list.forEach(product => {
            product.url = '/subpackage/goods_list/goods_list?' + product.navigator_url.split('?')[1]
          })
        })
        
        this.floorList=res.message
      },
      
      //点击搜索导航到搜索页面
      gotoSearch(){
        uni.navigateTo({
          url:'/subpackage/search/search'
        })
      }
      
      
    }
  } 
</script>

<style lang="scss">
.serach-box{
  top: 0;
  position: sticky;
  z-index: 999;
}
  
swiper{
  height: 330rpx;
  
  .swiper-item,image{
    width: 100%;
    height: 100%;
  }
  
}

.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15rpx 0;

  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}

.floor-title{
  width: 100%;
  height: 60rpx;
}

.right-img-box{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.floor-img-box{
  display: flex;
  padding-left: 10rpx;
}
</style>
