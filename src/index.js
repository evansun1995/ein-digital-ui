// import element from 'element-ui'
import Dialog from '../packages/dialog'
import Drawer from '../packages/drawer'
import Tabel from '../packages/table'
import Scrollbar from '../packages/scrollbar'
import Tree from '../packages/tree'
import IconSvg from '../packages/icon'
import ImageViewer from '../packages/imageViewer'

const components = [Dialog, Drawer, Tabel, Scrollbar, Tree, IconSvg]

const install = function (Vue, opts = {}) {
  components.forEach((component) => {
    Vue.component(component.name, component)
  })
  Vue.prototype.$imageViewer = ImageViewer
  console.log('opts', opts)
  Vue.prototype.$EINDIGITAL = {
    layoutBottomSpace: opts.layoutBottomSpace || 0
  }
}

export default {
  version: '0.0.1',
  install
}
