import Vue from 'vue'
import Main from './main.vue'
let ImageViewerConstructor = Vue.extend(Main)

let instance

const ImageViewer = function (options = {}) {
  if (Vue.prototype.$isServer) return
  // 支持单张图片地址
  if (typeof options === 'string') {
    options = {
      urlList: [options]
    }
  }
  // 支持图片数组
  if (Array.isArray(options)) {
    options = {
      urlList: options
    }
  }
  let userOnClose = options.onClose
  options.onClose = function () {
    ImageViewer.close(userOnClose)
  }
  // 如果存在实例
  if (instance) {
    instance.open(options)
    return instance
  }
  instance = new ImageViewerConstructor({
    data: options
  })
  instance.$mount()
  document.body.appendChild(instance.$el)
  instance.visible = true
  return instance
}

ImageViewer.close = function (userOnClose) {
  instance.close()
  typeof userOnClose === 'function' && userOnClose()
}

export default ImageViewer
