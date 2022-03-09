<template>
  <div ref="container" class="ein-table">
    <div class="ein-table_main">
      <el-table
        ref="elTable"
        v-loading="loading"
        :data="data"
        :size="size"
        :fit="fit"
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
        :stripe="stripe"
        :tree-props="treeProps"
        :row-key="rowKey"
        :expand-row-keys="expandRowKeys"
        :lazy="lazy"
        :load="loadFunction"
        :show-summary="showSummary"
        :sum-text="sumText"
        :summary-method="summaryMethod"
        :cell-style="cellStyle"
        :row-class-name="rowClassName"
        :row-style="rowStyle"
        :current-row-key="currentRowKey"
        :empty-text="emptyText"
        :default-expand-all="defaultExpandAll"
        :default-sort="defaultSort"
        :tooltip-effect="tooltipEffect"
        :select-on-indeterminate="selectOnIndeterminate"
        :indent="indent"
        @select="eventEmit('select', arguments)"
        @select-all="eventEmit('select-all', arguments)"
        @selection-change="eventEmit('selection-change', arguments)"
        @cell-mouse-enter="eventEmit('cell-mouse-enter', arguments)"
        @cell-mouse-leave="eventEmit('cell-mouse-leave', arguments)"
        @cell-click="eventEmit('cell-click', arguments)"
        @cell-dblclick="eventEmit('cell-dblclick', arguments)"
        @row-click="handleRowClick"
        @row-contextmenu="eventEmit('row-contextmenu', arguments)"
        @row-dblclick="eventEmit('row-dblclick', arguments)"
        @header-click="eventEmit('header-click', arguments)"
        @header-contextmenu="eventEmit('header-contextmenu', arguments)"
        @sort-change="eventEmit('sort-change', arguments)"
        @filter-change="eventEmit('filter-change', arguments)"
        @current-change="eventEmit('current-change', arguments)"
        @header-dragend="eventEmit('header-dragend', arguments)"
        @expand-change="eventEmit('expand-change', arguments)"
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
    // start：ein-ui 拓展属性
    load: {
      type: Function
    },
    autoLoad: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    autoHeight: {
      type: Boolean,
      default: false
    },
    extraSpace: {
      type: Number,
      default: 0
    },
    loadFunction: {
      type: Function
    },
    checkOnRowClick: {
      type: Boolean,
      default: true
    },
    // end：ein-ui 拓展属性

    // start：element-ui 属性
    data: {
      type: Array,
      default: () => [],
      required: true
    },
    height: [String, Number],
    maxHeight: [String, Number],
    stripe: {
      type: Boolean,
      default: false
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
    size: {
      type: String,
      validator: function (value) {
        return ['medium', 'small', 'mini'].indexOf(value) !== -1
      }
    },
    fit: {
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
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {
      type: Boolean
    },
    currentRowKey: {},
    headerRowStyle: {},
    headerRowClassName: {},
    headerCellStyle: {},
    headerCellClassName: {},
    border: {
      type: Boolean,
      default: false
    },
    spanMethod: {
      type: Function
    },
    treeProps: {
      type: Object,
      default: () => {
        return { hasChildren: 'hasChildren', children: 'children' }
      }
    },
    rowKey: {},
    expandRowKeys: {},
    lazy: {},
    showSummary: {},
    sumText: {
      type: String,
      default: '合计'
    },
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
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    defaultExpandAll: {
      type: Boolean
    },
    defaultSort: {
      type: Object
    },
    tooltipEffect: {
      type: String
    },
    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },
    indent: {
      type: Number,
      default: 16
    }
    // end：element-ui 属性
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
    tableExtraSpace() {
      return this.extraSpace || (this.$EINDIGITAL || {}).tableExtraSpace || 0
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
    eventEmit(eventName, args) {
      this.$emit(eventName, ...args)
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
          const PAGENIGATION_HEIGHT = 34 + 20
          const PAGE_MARGIN_BOTTOM = 10
          tableHeight -= this.showPagination ? PAGENIGATION_HEIGHT : PAGE_MARGIN_BOTTOM
          tableHeight -= Number(this.tableExtraSpace)
          tableHeight = tableHeight < 150 ? 150 : tableHeight
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
    setCurrentRow(row) {
      this.$refs.elTable.setCurrentRow(row)
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
  /deep/.el-button--text {
    padding-top: 0;
    padding-bottom: 0;
  }
  /deep/.el-button--small {
    font-size: 14px;
  }
  /deep/.el-table--mini {
    font-size: 12px;
    .el-table__cell {
      padding: 6px 0;
    }
    .cell {
      line-height: 18px;
    }
  }
  /deep/.el-table--small {
    font-size: 14px;
    .el-table__cell {
      padding: 10px 0;
    }
    .cell {
      line-height: 20px;
    }
  }
  /deep/.cell {
    white-space: nowrap;
  }
}
.ein-table_main {
  /deep/.el-table {
    color: #2d4059;
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
  align-items: center;
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
</style>
