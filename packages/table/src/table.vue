<template>
  <div ref="container" class="ein-table">
    <div class="ein-table_main">
      <el-table
        ref="elTable"
        v-loading="loading"
        :data="data"
        :size="size"
        :height="finalTableHeight"
        :max-height="maxHeight"
        :show-header="showHeader"
        :highlight-current-row="highlightCurrentRow"
        :header-row-style="headerRowStyle"
        :header-row-class-name="headerRowClassName"
        :header-cell-style="headerCellStyle"
        :header-cell-class-name="headerCellClassName"
        :cell-class-name="cellClassName"
        :span-method="spanMethod"
        :border="border"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        @current-change="currentChange"
        @expand-change="expandChange"
        :tree-props="treeProps"
        :row-key="rowKey"
        :expand-row-keys="expandRowKeys"
        :lazy="lazy"
        :load="loadFunction"
        :show-summary="showSummary"
        :summary-method="summaryMethod"
        :cell-style="cellStyle"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
      >
        <slot></slot>
      </el-table>
    </div>
    <div v-if="showPagination" class="ein-table_pagination">
      <el-pagination
        background
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        :layout="layout"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
import store from './store'
import { Table, Pagination } from 'element-ui'
export default {
  name: 'einTable',
  props: {
    data: {
      type: Array,
      default: () => [],
      required: true
    },
    load: {
      type: Function
    },
    loadFunction: {
      type: Function
    },
    pageSize: {
      type: Number,
      default: 20
    },
    currentPage: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    size: {
      default: 'medium',
      validator: function (value) {
        return ['medium', 'small', 'mini'].indexOf(value) !== -1
      }
    },
    autoHeight: {
      type: Boolean,
      default: false
    },
    layoutBottomSpace: {
      type: Number,
      default: 0
    },
    autoLoad: {
      type: Boolean,
      default: true
    },
    layout: {
      type: String,
      default: 'prev, pager, next, sizes, jumper'
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    height: [String, Number],
    maxHeight: [String, Number],
    showHeader: {
      type: Boolean,
      default: true
    },
    checkOnRowClick: {
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {
      type: Boolean
    },
    headerRowStyle: {},
    headerRowClassName: {},
    headerCellStyle: {},
    headerCellClassName: {},
    border: {
      type: Boolean
    },
    spanMethod: {
      type: Function
    },
    treeProps: {},
    rowKey: {},
    expandRowKeys: {},
    lazy: {},
    showSummary: {},
    summaryMethod: {
      type: Function
    },
    cellClassName: {
      type: Function
    },
    cellStyle: {
      type: Function
    },
    rowClassName: {
      type: Function
    },
    rowStyle: {
      type: Function
    }
  },
  components: {
    [Table.name]: Table,
    [Pagination.name]: Pagination
  },
  computed: {
    autoCalcHeight() {
      return this.autoHeight && !this.height
    },
    finalTableHeight() {
      return this.autoCalcHeight ? this.tableHeight : this.height
    },
    bottomSpace() {
      return this.layoutBottomSpace || (this.$EINDIGITAL || {}).layoutBottomSpace
    }
  },
  data() {
    return {
      showAdvancedSearch: false,
      tableHeight: null,
      resizeTimer: null,
      tempPage: this.currentPage,
      tempSize: this.pageSize
    }
  },
  methods: {
    loadData() {
      let query = {
        currentPage: this.tempPage,
        pageSize: this.tempSize
      }
      this.load && this.load(query)
    },
    handleSelectionChange(val) {
      this.$emit('selection-change', val)
    },
    handleSizeChange(size) {
      this.tempSize = size
      this.$emit('update:pageSize', size)
      this.loadData()
    },
    handleCurrentChange(page) {
      this.tempPage = page
      this.$emit('update:currentPage', page)
      this.loadData()
    },
    calcHeight() {
      this.calcTableHeight()
    },
    // 收缩动画一般是300ms
    calcTableHeight(delay = 400) {
      typeof window === 'object' && window.clearTimeout(this.resizeTimer)
      this.resizeTimer =
        typeof window === 'object' &&
        window.setTimeout(() => {
          if (!this.$refs.elTable) {
            return
          }
          let dom = this.$refs.elTable.$el
          let top = 0
          do {
            top += dom.offsetTop // 如果是左侧就是offsetLeft
            dom = dom.offsetParent // 如果DOM 节点 的parentNode存在，把当前的节点赋予成parentNode；
          } while (dom && dom.offsetParent)
          let tableHeight = typeof window === 'object' && window.innerHeight - top
          const PAGENIGATION_HEIGHT = 32 + 20
          const PAGE_MARGIN_BOTTOM = 10
          tableHeight -= this.showPagination ? PAGENIGATION_HEIGHT : PAGE_MARGIN_BOTTOM
          console.log(this.bottomSpace)
          tableHeight -= Number(this.bottomSpace)
          tableHeight = tableHeight < 150 ? 150 : tableHeight
          /* let isPercentageString = /^\d+%$/.test(this.height)
          if (this.height && isPercentageString) {
            let multiple = Number(this.height.slice(0, -1)) / 100
            tableHeight *= multiple
          } */
          this.tableHeight = tableHeight + 'px'
        }, delay)
    },
    handleRowClick(row, column, event) {
      this.checkOnRowClick && this.$refs.elTable.toggleRowSelection(row)
      this.$emit('row-click', ...arguments)
    },
    clearSelection() {
      this.$refs.elTable.clearSelection()
    },
    toggleRowSelection() {
      this.$refs.elTable.toggleRowSelection(...arguments)
    },
    currentChange() {
      this.$emit('current-change', ...arguments)
    },
    setCurrentRow(row) {
      this.$refs.elTable.setCurrentRow(row)
    },
    expandChange(row, expanded) {
      this.$emit('expand-change', row, expanded)
    }
  },
  created() {
    this.autoLoad && this.loadData()
    store.commit('addTable', this)
  },
  mounted() {
    if (this.autoCalcHeight) {
      this.calcTableHeight()
    }
  },
  beforeDestroy() {
    store.commit('removeTable', this)
  }
}
</script>
<style lang="scss" scoped>
.ein-table {
  /deep/.cell {
    white-space: nowrap;
  }
}
.ein-table_main {
  /deep/.el-table {
    th,
    td {
      &:not(.is-left) {
        text-align: center;
      }
    }
    th {
      background-color: #f4f4f4;
      color: #405271;
    }
  }
}
.ein-table_pagination {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
  /deep/.el-pagination.is-background .btn-prev,
  /deep/.el-pagination.is-background .btn-next,
  /deep/.el-pagination.is-background .el-pager li:not(.active) {
    background-color: #fff;
    border: 1px solid #dcdfe6;
  }
}
/deep/.el-table__fixed-right {
  height: 100% !important;
}
/deep/.el-table th {
  font-weight: normal;
  color: #606266;
  font-size: 12px;
}
</style>
