const state = {
  data: []
}

const mutations = {
  UPDATE_PROGRESS_LIST (state, list) {
    state.data = list
  }
}

const actions = {
  updateProgressList ({ commit }, list) {
    commit('UPDATE_PROGRESS_LIST', list)
  }
}

export default {
  state,
  mutations,
  actions
}
