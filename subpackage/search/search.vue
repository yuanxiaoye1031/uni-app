<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar placeholder="请输入搜索内容"  @input="input" :radius="100" cancelButton="none" @confirm="gotoGoodsList"></uni-search-bar>
    </view>
    
    <!-- 搜索历史 -->
    <view class="history-box">
      <!-- 标题 -->
      <view class="history-tilte" v-if="historyList.length!==0">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="removeHistory"></uni-icons>
      </view>
      
      <!-- 列表 -->
      <view class="history-list" v-if="searchResults.length===0">
        <view></view>
        <view v-for="(h,index) in histories" :key="index" class="tag-box" @click="tagClickHandler(h)">
          <uni-tag :text="h" inverted="true" />
          <uni-icons type="minus" v-if="delState"></uni-icons>
        </view>
      </view>
      <text class="remove-text" v-if="delState" @click="clearHistory">清空搜索记录</text>
    </view>
    
    
    <!-- 搜索建议区域 -->
    <view class="suggest-list">
      <view v-if="searchResults.length===0" class="no-suggest">当前暂无建议，请输入关键词</view>
      <view class="suggest-item" v-for="good in searchResults" :key="good.goods_id" @click="gotoDetail(good)">
        <view class="goods-name">{{good.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    
    
    
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer:null,
        keyword:'',
        searchResults:[],
        historyList:[],
        delState:false, //是否处于删除状态
      };
    },
    computed:{
      histories(){
        return [...this.historyList].reverse()
      }
    },
    methods:{
      //搜索框的输入事件
      input(val){
        clearTimeout(this.timer)
        this.timer =  setTimeout(()=>{
          this.keyword=val.trim()
          this.getSearchResults()
          if(val!='') this.saveSerachHistory(val)
        },500)
      },
      
      //点搜索后跳转到商品列表
      gotoGoodsList(){
        uni.navigateTo({
          url:'/subpackage/goods_list/goods_list?query='+this.keyword
        })
      },
      
      //获取搜索建议
      async getSearchResults(){
        //判断搜索关机按此是否为空
        if(this.keyword.length === 0) {
          this.searchResults=[]
          return 
        }
        
        const{data : res} = await uni.$http.get('/api/public/v1/goods/qsearch',{query:this.keyword})
        if(res.meta.status!==200) return uni.$showMsg()
        
        this.searchResults=res.message
      },
      
      //跳转商品详情
      gotoDetail(good){
        uni.navigateTo({
          url:'/subpackage/goods_detail/goods_detail?goods_id='+good.goods_id
        })
        
      },
      
      //存储搜索历史
      saveSerachHistory(val){
        const index=this.historyList.indexOf(val)
        if(index!==-1) {
          this.historyList.splice(index,1)
        }
        this.historyList.push(val)
        uni.setStorageSync('history',JSON.stringify(this.historyList))
      },
      
      //删除搜索记录
      removeHistory(){
        this.delState=!this.delState
        if(this.delState) uni.$showMsg('点击标签进行删除') 
        
        if(!this.delState){
          uni.setStorageSync('history',JSON.stringify(this.historyList))
        }
        
      },
      
      //删除搜索记录标签或跳转到商品列表
      tagClickHandler(h){
        if(this.delState){
          const index = this.historyList.indexOf(h)
          this.historyList.splice(index,1)
        }
        else{
          uni.navigateTo({
            url:'/subpackage/goods_list/goods_list?query='+h
          })
        }
      },
      
      //清空搜索记录
      clearHistory(){
        if(this.delState){
          uni.showModal({
            title:'提示',
            content:'您确认要清空历史记录吗？',
            success: (res)=> {
              if (res.confirm) {
                //确认清空
                this.historyList=[]
                uni.setStorageSync('history',this.historyList)
                this.delState=false
              } 
            }
          })
        }
      }
    },
    
    
    onLoad() {
      this.historyList=JSON.parse(uni.getStorageSync('history'))||[]
    }
  }
</script>

<style lang="scss">
.search-box{
  position: sticky;
  top:0;
  z-index: 999;
}

.suggest-list{
  padding: 0 5px;
  
  .no-suggest{
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
  }
  
  .suggest-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    .goods-name{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.history-box{
  padding: 0 5px;
  text-align: center;
  
  .remove-text{
    opacity: 40%;
    font-size: 13px;
  }
  
  
  .history-tilte{
    display: flex;
    justify-content: space-between;
    height: 40px;
    align-items: center;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }
  
  .history-list{
    display: flex;
    flex-wrap: wrap;
    
    .tag-box{
      display: inline-block;
      margin-right: 5px;
      margin-bottom: 9px;
      .uni-tag{
        margin-top: 5px;
      }
    }
    
    
  }
}

</style>
