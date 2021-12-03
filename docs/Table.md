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
<div class="docs-table-wrapper">

| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| --- | --- | --- | --- | --- |
| **auto-height** | 开启后组件会自动计算Table高度，如果设置了`height`属性，将不会自动计算，该属性和`max-height`兼容。<br/>高度计算方法：屏幕高度 - 距根元素顶部距离 - 分页高度或10px。<br/>自动计算时，表格高度不会低于150px。 | boolean | — | false |
| data | 显示的数据 | array | — | — |

</div>
