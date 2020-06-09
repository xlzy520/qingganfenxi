<template>
  <div class="base-table">
    <el-table
      ref="baseTable"
      v-loading="loading"
      v-bind="$attrs"
      highlight-current-row
      :data="tableData"
      header-row-class-name="header-row"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      v-on="$listeners"
    >
      <el-table-column
        v-if="selection"
        type="selection"
        width="55"
      />
      <el-table-column
        v-if="index"
        type="index"
        width="55"
        label="序号"
        align="center"
      />
      <el-table-column
        v-for="col in columns"
        :key="col.label"
        :align="col.align||'center'"
        v-bind="col"
      >
        <template v-if="col.component" slot-scope="scope">
          <component :is="col.component" v-bind="getComponentBind(scope, col)" />
        </template>
        <el-table-column
            v-for="scopeCol in col.columns"
            :key="scopeCol.label"
            :align="scopeCol.align||'center'"
            v-bind="scopeCol"
        >
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="count>pageSize"
      class="pagination"
      background
      :current-page="pageNo"
      :page-size="pageSize"
      prev-text="上一页"
      next-text="下一页"
      layout="sizes,prev, pager, next, jumper"
      :total="count"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>
<script>
// 为无component列创建一个component
const defaultComponent = function() {
  return {
    functional: true,
    render(h, { props: { row, col }, _v: text }) {
      const { formatter } = col
      // if (row[col.prop] === 0) {
      //   return text(0)
      // }
      const v = formatter && formatter(row, col) || row[col.prop] || ''
      return text && text(v) || v
    }
  }
}
export default {
  name: 'BaseTable',
  props: {
    // 是否有选择框
    selection: {
      type: Boolean,
      default: false
    },
    // 表格数据
    tableData: {
      type: Array,
      default: () => { [] }
    },
    // 表格头部配置
    tableColumns: {
      type: Array,
      default: () => { [] }
    },
    loading: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 0
    },
    // 当前页码
    pageNo: {
      type: Number,
      default: 1
    },
    // 当前页数据最多展示数量
    pageSize: {
      type: Number,
      default: 15
    },
    index: Boolean
  },
  data() {
    return {
      // 处理后的表头数据
      columns: []
    }
  },
  mounted() {
    // 处理表头数据
    this.columns = this.tableColumns.filter(v => !v.hidden).map(col => {
      const temp = defaultComponent()
      if (col.render) {
        temp.render = col.render
      }
      // 显示索引号，只能允许有type=index一个属性
      if (col.type === 'company.vue') {
        return { ...col }
      }
      return {
        ...col,
        component: temp
      }
    })
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('change-page', val)
    },
    handleSizeChange(val) {
      this.$emit('size-change', val)
    },
    // 使用v-bind展开props到组件上
    getComponentBind({ row, column, $index }, col) {
      return { row, col, column, $index }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "../styles/pagination.scss";
  .base-table {
    width: 100%;
    /deep/ .double-row {
      background-color: #f6fdf3;
    }
    /deep/ .header-cell {
      background-color: #f4f5fb;
    }
    /deep/ .el-pager li {
      font-weight: lighter;
      border-radius: 2px;
      color: #4d4d4d;
      background: #f7f7f7;
      margin-left: 5px;
    }
    /deep/ .header-row th{
      background-color: #fafafa;
      color: rgba(0,0,0,.85);
      font-weight: 500;
    }
  }
</style>
