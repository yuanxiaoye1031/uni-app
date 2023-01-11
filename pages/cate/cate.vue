<template>
  <view>
    <my-search @click.native="gotoSearch"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height: windowHeight-50 + 'px'}">
        <block v-for="(cate,index) in cateList" :key="cate.cat_id">
          <view class="left-scroll-view-item" :class="index===activeIndex?'active':''" @click="activeChange(index)">{{cate.cat_name}}</view>
        </block>
      </scroll-view>
      <!-- 右侧的滚动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{height: windowHeight-50 + 'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="cate2 in cateLevel2List" :key="cate2.cat_id">
          <!-- 二级分类标题 -->
          <view class="cate-lv2-title">/{{cate2.cat_name}}/</view>
          
          <!-- 三级分类盒子 -->
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="cate3 in cate2.children" :key="cate3.cat_id" @click="gotoGoodsList(cate3)">
              <image :src="cate3.cat_icon.replace('dev','web')"></image>
              <text>{{cate3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    </view>
</template>

<script>
  
  export default {
    data() {
      return {
        //当前窗口可用高度
        windowHeight:0,
        //分类列表
        cateList:[],
        //激活项索引
        activeIndex:0,
        //二级分类内容列表
        cateLevel2List:[],
        //滚动事件标志位
        scrollTop:0,
      };
    },
    components:{
    },
    onLoad(){
      const sysInfo = uni.getSystemInfoSync() 
      this.windowHeight=sysInfo.windowHeight
      this.getCateList()
    },
    methods:{
      //获取分类列表
      async getCateList(){
        const {data : res} = await uni.$http.get('/api/public/v1/categories')
        if(res.meta.status !== 200) return uni.$showMsg()
        this.cateList=res.message
        this.cateLevel2List=res.message[0].children //默认先存第一个一级分类的二级分类内容
      },
      
      //点击分类后修改activeIndex
      activeChange(index){
        this.activeIndex=index
        //修改二级分类列表内容
        this.cateLevel2List=this.cateList[index].children
        this.scrollTop= this.scrollTop===0?1:0
      },
      
      //点击商品前往商品列表页
      gotoGoodsList(cate3){
        uni.navigateTo({
          url:`/subpackage/goods_list/goods_list?cid=` + cate3.cat_id
        })
      },
      
      gotoSearch(){
        uni.navigateTo({
          url:'/subpackage/search/search'
        })
      }
    }
  }
</script>

<style lang="scss">
.scroll-view-container{
  display: flex;
  
  .left-scroll-view{
    width: 120px;
    
    .left-scroll-view-item{
      background-color: #f7f7f7;
      line-height: 60px;
      text-align: center;
      font-size: 12px;    
      
      &.active{
        background-color: #FFFFFF;
        position: relative;
        
        &::before{
          content: '';
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          left: 0;
          top: 25%;
        }
      }
      }
  }
}

.right-scroll-view{
  background-color: #FFFFFF;
  
  .cate-lv2-title{
    background-color: #f7f7f7;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }
  
  .cate-lv3-list{
    display: flex;
    flex-wrap: wrap;
    
    .cate-lv3-item{
      width: 33.33%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      
      image{
        width: 60px;
        height: 60px;
      }
      
      text{
        font-size: 12px;
      }
    }
  }
}

</style>
