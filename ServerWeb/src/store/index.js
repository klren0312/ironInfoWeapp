import Vue from 'vue'
import Vuex from 'vuex'
import Storage from 'zstorage'

Vue.use(Vuex)

const state = {
  user: null,
  baseUrl: apiServer,
  token: '',
  themeValue: 'black'
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  LOG_OUT(state) {
    state.user = null
    Storage.set('admin_user', null)
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_THEME(state, theme) {
    state.themeValue = theme
  }
}

const actions = {
  LOG_OUT({ commit }) {
    commit('LOG_OUT')
  },
  SET_USER(state, user) {
    state.commit('SET_USER', user)
  },
  SET_TOKEN(state, token) {
    state.commit('SET_TOKEN', token)
  },
  SET_THEME(state, theme) {
    state.commit('SET_THEME', theme)
  }
}

export default new Vuex.Store({
  state,
  mutations,
  getters: {},
  actions: actions
})
