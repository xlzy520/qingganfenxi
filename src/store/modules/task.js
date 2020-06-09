
const state = {
  allTask: [],
  taskData: []
}

const mutations = {
  change_all_task: (state, data) => {
    state.allTask = data
  },
  change_task_data: (state, data) => {
    state.taskData = data
  },
  
}

const actions = {
  change_all_task({ commit }, data) {
    commit('change_all_task', data)
  },
  change_task_data({ commit }, data) {
    commit('change_task_data', data)
  },
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

