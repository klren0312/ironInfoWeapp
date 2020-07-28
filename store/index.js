import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		// rootUrl: "http://localhost:7001/api/v1",
		rootUrl: "https://tlgcapi.zzes1314.cn/api/v1",
		rootUrl2: "https://tlgcapi.zzes1314.cn/api/v2",
		userinfo: false,
		infos: {}
	},
	mutations: {
		SET_INFO (state, status) {
			state.userinfo = status
		},
		SAVE_INFO (state, info) {
			state.infos = info
		}
	},
	actions: {
	}
})

export default store
