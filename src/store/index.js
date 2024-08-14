import { createStore } from 'vuex'

export default createStore({
  state: {
    authToken: null,
    sidebarVisible: '',
    sidebarUnfoldable: false,
    theme: 'light',
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    }
  },
  actions: {
  },
  getters: {
  },
  modules: {},
})
