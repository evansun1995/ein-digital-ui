<template>
  <el-scrollbar ref="scrollbar" class="ein-scrollbar" :style="{ height, width }">
    <slot />
  </el-scrollbar>
</template>
<script>
import { Scrollbar } from 'element-ui'
export default {
  name: 'einScrollbar',
  components: {
    [Scrollbar.name]: Scrollbar
  },
  props: {
    height: {
      type: String,
      default: '100%'
    },
    width: {
      type: String,
      default: '100%'
    },
    debounce: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      scrollState: {
        moveX: 0,
        scrollLeft: 0,
        moveY: 0,
        scrollTop: 0,
        currentTimer: null
      }
    }
  },
  methods: {
    backLeft() {
      this.scrollTo({ x: 0 })
    },
    backTop() {
      this.scrollTo({ y: 0 })
    },
    scrollTo(params) {
      if (typeof params !== 'object') {
        throw new Error('ein-scrollbar error : scrollTo参数需要是object类型')
      }
      let { x, y } = params
      if (y !== undefined) {
        y = Number(y)
        if (isNaN(y)) {
          throw new Error('ein-scrollbar error : y 需要是一个有效的数字')
        }
        // 滚动条
        this.$refs.scrollbar.moveY = y
        // 内容
        this.$refs.scrollbar.$refs.wrap.scrollTop = y
      }
      if (x !== undefined) {
        x = Number(x)
        if (isNaN(x)) {
          throw new Error('ein-scrollbar error : x 需要是一个有效的数字')
        }
        // 滚动条
        this.$refs.scrollbar.moveX = x
        // 内容
        this.$refs.scrollbar.$refs.wrap.scrollLeft = x
      }
    },
    saveScroll() {
      this.scrollState = {
        moveX: this.$refs.scrollbar.moveX,
        scrollLeft: this.$refs.scrollbar.$refs.wrap.scrollLeft,
        moveY: this.$refs.scrollbar.moveY,
        scrollTop: this.$refs.scrollbar.$refs.wrap.scrollTop
      }
    },
    loadScroll() {
      this.$refs.scrollbar.moveX = this.scrollState.moveX
      this.$refs.scrollbar.$refs.wrap.scrollLeft = this.scrollState.scrollLeft
      this.$refs.scrollbar.moveY = this.scrollState.moveY
      this.$refs.scrollbar.$refs.wrap.scrollTop = this.scrollState.scrollTop
    },
    onScroll(e) {
      if (this.debounce) {
        typeof window === 'object' && window.clearTimeout(this.currentTimer)
        this.currentTimer =
          typeof window === 'object' &&
          window.setTimeout(() => {
            this.emitScroll(e)
          }, 300)
        return
      }
      this.emitScroll(e)
    },
    emitScroll(e) {
      let scrollData = {
        x: e.target.scrollLeft,
        y: e.target.scrollTop
      }
      this.$emit('scroll', scrollData)
    }
  },
  mounted() {
    let wrap = this.$el.getElementsByClassName('el-scrollbar__wrap')[0]
    wrap.addEventListener('scroll', (e) => {
      this.onScroll(e)
    })
  }
}
</script>
<style lang="scss" scoped>
.ein-scrollbar {
  /deep/.el-scrollbar__wrap {
    height: calc(100% + 17px);
    .el-scrollbar__view {
      min-height: 100%;
    }
  }
}
</style>
