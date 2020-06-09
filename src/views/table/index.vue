<template>
  <div class="app-container">
    <div class="header">
      <el-form ref="searchForm" :model="searchForm" :inline="true" size="medium">
        <el-form-item prop="saveDate">
          <el-date-picker
              v-model="searchForm.saveDate"
              type="daterange"
              align="center"
              start-placeholder="添加日期起"
              end-placeholder="添加日期止"
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="()=>fetchData(true)">查询</el-button>
          <el-button type="success" @click="add">添加任务</el-button>
        </el-form-item>
      </el-form>
    </div>
    <xl-table
        border
        :loading="loading"
        :table-data="tableData"
        :table-columns="columns"
        :count="count"
        :pageSize="pageOption.pageSize"
        :pageNo="pageOption.pageIndex"
        @change-page="pageChange"
        @size-change="sizeChange"
    />
  </div>
</template>

<script>
import { getList } from '@/api/table'
import pagination from "@/mixins/pagination";

export default {
  mixins: [pagination],
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      loading: false,
      tableData: [],
      columns: [
        {label: 'ID号', prop: 'id', align: 'center'},
        {label: '名称', prop: 'name', align: 'center'},
        {label: '状态', prop: 'status', render: (h, { props: { row }}) => {
            if (row.status) {
              return (
                <el-tag effect={'dark'} type={'success'}>已完成</el-tag>
            )}
            return (
              <el-tag effect={'dark'} type={'info'}>未完成</el-tag>
          )} },
        {label: '创建时间', prop: 'saveDate', align: 'center', width: 180,},
        { label: '操作',
          render: (h, { props: { row }}) => {
            return (
              <div class='table-action'>
                <a onClick={() => this.exportExcel(row)}>导出</a>
              </div>
            )
          } }
      ],
      searchForm: {
        saveDate: []
      },

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      getList().then(response => {
        console.log(response);
        this.tableData = response.data.items
      }).finally(() => {
        this.loading = false
      })
    },
    add(){

    },
  }
}
</script>

<style lang="scss">
  .table-action{
    color: #20a0ff;
  }
</style>
