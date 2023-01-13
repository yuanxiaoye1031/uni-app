export default {
  namespaced:true,
  actions:{
    addToCart(context,goods){
      context.commit('ADD_TO_CART',goods)
      context.commit('SAVE_CART_TO_SOTRAGE')
    },
    changeGoodsState(context,index){
      context.commit('CHANGE_GOODS_STATE',index)
      context.commit('SAVE_CART_TO_SOTRAGE')
    },
    saveCartToStorage(context){
      context.commit('SAVE_CART_TO_SOTRAGE')
    },
    changeGoodsCount(context,{goods,val}){
      context.commit('CHANGE_GOODS_COUNT',{
        goods:goods,
        val:val
      })
      context.commit('SAVE_CART_TO_SOTRAGE')
    },
    removeGoods(context,goods){
      context.commit('REMOVE_GOODS',goods)
      context.commit('SAVE_CART_TO_SOTRAGE')
    },
    updateAllGoodsState(context,newState){
      context.commit('UPDATE_ALL_GOODS_STATE',newState)
      context.commit('SAVE_CART_TO_SOTRAGE')
    }
  },
  state:{
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')  
  },
  mutations:{
    ADD_TO_CART(state,goods){
      //先在购物车中查找
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      
      //如果购物车没有该商品
      if(!findResult) {
        state.cart.push(goods)
      }
      else{
        //购物车中已经有该商品应该让他数量加1
        findResult.goods_count++
      }
      
    },
    SAVE_CART_TO_SOTRAGE(state){
      uni.setStorageSync('cart',JSON.stringify(state.cart))
    },
    CHANGE_GOODS_STATE(state,index){
      state.cart[index].goods_state=!state.cart[index].goods_state
    },
    CHANGE_GOODS_COUNT(state,{goods,val}){
      
      //先在购物车中查找
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      
      if(findResult){
        //购物车中已经有该商品应该让他数量加1
        findResult.goods_count=val
      }
    },
    
    REMOVE_GOODS(state,goods){
      let index=state.cart.indexOf(goods)
      console.log(index)
      state.cart.splice(index,1)
    },
    
    UPDATE_ALL_GOODS_STATE(state,newState){
      state.cart.forEach(x => x.goods_state = newState)
    }
      
  },
  getters:{
    //购物车中所有商品数
    total(state){
      let c = 0
      state.cart.forEach(x => c+=x.goods_count)
      return c
    },
    
    //购物车中已勾选的商品数
    checkedCount(state){
      return state.cart.filter(x => x.goods_state).reduce((total,item) =>  total += item.goods_count,0)
    },
    
    //购物车中已勾选的商品总价
    checkedGoodsPrice(state){
      return state.cart.filter(x => x.goods_state).reduce((total,item) => total+=item.goods_price * item.goods_count,0).toFixed(2)
    }
  }
}