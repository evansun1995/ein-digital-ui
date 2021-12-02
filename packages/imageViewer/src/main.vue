<template>
  <transition name="viewer-fade">
    <el-image-viewer :z-index="zIndex" :initial-index="index" v-if="visible" :on-close="onClose" :url-list="urlList" />
  </transition>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'EinImageViewer',
  components: {
    ElImageViewer
  },
  data() {
    return {
      zIndex: 2000,
      index: 0,
      visible: false,
      urlList: [],
      onClose: () => {}
    }
  },
  methods: {
    open(options) {
      Object.keys(options).forEach((key) => {
        this[key] = options[key]
      })
      this.visible = true
    },
    close() {
      this.visible = false
    }
  }
}
</script>
<style lang="scss">
</style>
