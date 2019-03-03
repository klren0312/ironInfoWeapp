import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		rootUrl: "https://tlgcapi.zzes1314.cn/api/v1",
		// rootUrl: "http://localhost:7001/api/v1",
		userinfo: false
	},
	mutations: {
		SET_INFO (state, status) {
			state.userinfo = status
		 }
	},
	actions: {
	}
})

export default store
