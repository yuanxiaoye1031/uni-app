import {mapGetters} from 'vuex'

export default {
  computed:{
    ...mapGetters('moduleCart',['total'])
  },
  methods:{
    setBadge() {
      uni.setTabBarBadge({
        index:2,
        text:`${this.total}`
      })
      if(this.total===0) uni.removeTabBarBadge({
        index:2
      })
    }
  },
  onShow(){
    this.setBadge()
    
  },
  watch:{
    total(){
      this.setBadge()
      
    }
  }
}






