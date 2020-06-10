<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
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
