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
          <div class="header-btns">
            <el-button type="primary" icon="el-icon-search" @click="()=>fetchData(true)">查询</el-button>
            <el-upload
                accept=".csv,.xlsx,.xls"
                :show-file-list="false"
                class="upload-btn" action="" :on-error="add">
              <el-button type="success">添加任务</el-button>
            </el-upload>
          </div>
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
import {mapGetters} from "vuex";
import {parseTime} from '@/utils/index'
import ExportJsonExcel from 'js-export-excel'
import dayjs from "dayjs";

export default {
  name: 'TaskList',
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
  computed: {
    ...mapGetters([
      'allTask',
      'taskData'
    ])
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
    fetchData(search) {
      this.loading = true
      getList().then(response => {
        if (search) {
          this.$message1000('查询成功')
        }
        this.tableData = this.allTask
      }).finally(() => {
        this.loading = false
      })
    },
    add(err, file, fileList){
      const newAllTask = [...this.allTask, {
        id: this.allTask.length + 1,
        name: file.name,
        saveDate: parseTime(Date.now()),
        status: true
      }]
      this.$store.dispatch('task/change_all_task', newAllTask).then(()=>{
        this.fetchData()
      })
    },
    handlePieData(date){
      const result = {}
      const datas = this.taskData
      for (let i = 1; i < datas.length; i++) {
        const item = datas[i]
        const isToday = item['field4'].includes(date)
        if (isToday) {
          let itemCount = result[item['field2']]
          if (itemCount !== undefined) {
            result[item['field2']] += 1
          } else {
            result[item['field2']] = 0
          }
        }
      }
      return result
    },

    exportExcel(row){
      const sheetData = []
      const emotions = ['冷静','积极','焦虑','恐惧','愤怒(质疑)']
      for (let i = 0; i < 32; i++) {
        const date = dayjs('2020/1/28').add(i, 'day').format('YYYY/M/D')
        const countData = this.handlePieData(date)
        const count = Object.values(countData).reduce((cur, pre)=>{
          return cur + pre
        }, 0)
        sheetData[i] = []
        emotions.forEach((emotion, index)=> {
          sheetData[i][0] = date
          const rate = ((countData[index] / count)*100).toFixed(2)
          sheetData[i][index + 1] = countData[index]+`(${rate}%)`
        })
      }
      const option = {}
      option.fileName = row.name

      option.datas = [
        {
          sheetData: sheetData,
          sheetHeader: ['日期','冷静','积极','焦虑','恐惧','愤怒(质疑)'],
          columnWidths: [18, 18]
        }
      ]
      const toExcel = new ExportJsonExcel(option) // new
      toExcel.saveExcel() // 保存
    }

  }
}
</script>

<style lang="scss">
  .table-action{
    color: #20a0ff;
  }
  .header-btns{
    display: flex;
    .upload-btn{
      margin-left: 30px;
    }
  }
</style>
