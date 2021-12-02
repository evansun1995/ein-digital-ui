import Table from './src/table.vue'
import store from './src/store'

typeof window === 'object' &&
  window.addEventListener('resize', function () {
    store.commit('calcAllTableHeight')
  })

Table.install = function (Vue) {
  Vue.component(Table.name, Table)
}

export default Table
