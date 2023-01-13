<template>
  <view>
    <view class="goods-list">
      <view v-for="goods in goodsList" :key="goods.goods_id" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  var util = require('../../utils/util')
  export default {
    data() {
      return {
        queryObj:{
          //查询关键字
          query:'',
          //商品分类ID
          cid:'',
          //页号
          pagenum:1,
          //每页数量
          pagesize:10
        },
        //商品列表
        goodsList:[],
        //商品总数
        total:0,
        isLoading:false
      };
    },
   
    onLoad(options) {
      this.queryObj.query=options.query || ''
      this.queryObj.cid = options.cid || ''
      this.getGoodsList()
    },
    
    methods:{
      //获取商品列表
      async getGoodsList(){
        this.isLoading=true
        const {data : res} = await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
        this.isLoading=false
        if(res.meta.status!==200) return uni.$showMsg()
        
        
        this.goodsList=[...this.goodsList,...res.message.goods]
        this.total=res.message.total
      },
      
      //跳转到商品详情
      gotoDetail(goods){
        uni.navigateTo({
          url:'/subpackage/goods_detail/goods_detail?goods_id='+goods.goods_id
        })
      },
      
    },
    
    //上拉触底，加载更多商品
    onReachBottom(){
      //让页码值加一
      if(!this.isLoading){
        this.queryObj.pagenum++
        this.getGoodsList()
      }
    },
    
    //上拉刷新
    onPullDownRefresh() {
      //后端每次请求返回的数据都相同，为了显示刷新的效果，这里用打乱数组来模拟
      //真正的刷新应该是：将页数设为1，然后清空goodsList，重新请求数据
      this.goodsList = util.shuffle(this.goodsList)
      setTimeout(()=>{
          wx.stopPullDownRefresh({
              success: (res) => {},
            })
      },1500)
    },
    
    
    
    
  }
</script>

<style lang="scss">
  .goods-list{
    background-color: #FFFFFF;
  }
  
</style>
