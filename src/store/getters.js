const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  allTask: state => state.task.allTask,
  taskData: state => state.task.taskData,
}
export default getters
