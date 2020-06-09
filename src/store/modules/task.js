
const state = {
  allTask: [
    {
      id: 1,
      name: '无症状感染者',
      saveDate: '2020-05-29 16:33:20',
      status: true
    }
  ],
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

