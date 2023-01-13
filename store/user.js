export default{
  namespaced:true,
  actions:{
    updateAddress(context,address){
      context.commit('UPDATE_ADDRESS',address)
      context.commit('SAVE_ADDRESS_TO_STORAGE')
    }
  },
  state:{
    address: JSON.parse(uni.getStorageSync('userAddress') || '{}')
  },
  mutations:{
   UPDATE_ADDRESS(state,address){
     state.address=address
   },
   SAVE_ADDRESS_TO_STORAGE(state){
     console.log('存储地址')
     uni.setStorageSync('userAddress',JSON.stringify(state.address))
   }
  },
  getters:{
    fuzzyAddr(state){
      return state.address.provinceName+state.address.cityName+state.address.countyName
    },
  }
}