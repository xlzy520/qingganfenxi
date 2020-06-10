<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'taskData'
    ])
  },
  mounted() {
    // this.handleData()
  },
  methods: {
    handleData() {
      fetch('./data.json').then(res=> res.json()).then(res=>{
        this.$store.dispatch('task/change_task_data', res)
        console.log(res);
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
