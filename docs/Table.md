# Table 表格

## 基础表格
这是一个基础的表格，开启`auto-height`属性，组件将自动计算表格高度刚好占满一屏。
::: demo 
```html
<template>
  <ein-table ref="einTable" :load="loadData" :loading="tableLoading" :data="tableData" auto-height :total="pageData.total" :current-page.sync="pageData.currentPage" :page-size.sync="pageData.pageSize" >
    <el-table-column prop="date" label="日期" width="180"></el-table-column>
    <el-table-column prop="name" label="姓名" width="180"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>
    <template #footer>
      <div style="margin-left: 10px"><el-button icon="el-icon-refresh" @click="loadData">刷新</el-button></div>
    </template>
  </ein-table>
</template>
<script>
export default {
  name: 'DemoTable',
  data() {
    return {
      tableData: [],
      tableLoading: true,
      pageData: {
          total:0,
          currentPage:1,
          pageSize:20
        },
    }
  },
  methods: {
    loadData(pageData) {
      this.tableLoading = true
      let searchQuery = {
        page: pageData.currentPage,
        size: pageData.pageSize
      }
      this.$mock.mockTableData(searchQuery).then(res=>{
        this.tableData = res.list
        this.pageData.total = res.total
        this.tableLoading = false
      })
    },
  },
  created() {}
}
</script>
<style lang="scss">
</style>
```
:::

## Table Attributes
这里只列举出区别于`element-ui`的属性，理论上`element-ui`所有属性都应做到支持，或通过其他方案替换。
<div class="docs-table-wrapper">
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| load | 加载表格数据的方法 | Function({currentPage,pageSize}) | — | — |
| auto-load | 是否在`created`中执行`load`函数 | boolean | true | — |
| loading | Table主体的loading动画 | boolean | — | — |
| auto-height | 开启后组件会自动计算Table高度。<br/>高度计算方法：屏幕高度 - 距根元素顶部距离 - 分页高度或10px - `extra-space`。<br/>自动计算时，表格高度不会低于150px。 | boolean | — | false |
| extra-space | `auto-height`为`true`时生效，计算表格高度时会减去该数值。 | number | — | — |
| tree-load | 等同于`element-ui`的`load`属性，加载子节点数据的函数。 | Function(row, treeNode, resolve) | — | — |
| check-on-row-click | 单击行时选中该行复选框 | boolean | — | true |

</div>
