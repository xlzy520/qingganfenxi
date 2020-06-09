export default {
  data() {
    return {
      pageOption: {
        pageIndex: 1,
        pageSize: 10
      },
      count: 0
    }
  },
  methods: {
    pageChange(val) {
      this.pageOption.pageIndex = val
      this.fetchData()
    },
    sizeChange(val) {
      this.pageOption.pageSize = val
      this.pageOption.pageIndex = 1
      this.fetchData()
    }
  }
}
