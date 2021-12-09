<template>
  <el-drawer
    class="ein-drawer"
    :class="{ 'with-footer': withFooter }"
    :title="title"
    :visible.sync="drawerVisible"
    :direction="direction"
    :show-close="showClose"
    :wrapperClosable="wrapperClosable"
    :size="size"
    :before-close="beforeClose"
    :withHeader="withHeader"
    append-to-body
  >
    <slot name="title" slot="title"></slot>
    <ein-scrollbar>
      <div class="ein-drawer_body-wrapper">
        <slot />
      </div>
    </ein-scrollbar>
    <div v-if="withFooter" class="drawer-footer">
      <slot v-if="$slots.footer" name="footer"></slot>
      <template v-else>
        <el-button @click="onCancel">{{ cancelText }}</el-button>
        <el-button type="primary" @click="onConfirm">{{ confirmText }}</el-button>
      </template>
    </div>
  </el-drawer>
</template>
<script>
import { Drawer, Button } from 'element-ui'
export default {
  name: 'einDrawer',
  props: {
    title: {
      type: String,
      default: ''
    },
    visible: {
      required: true,
      type: Boolean
    },
    direction: {
      type: String,
      default: 'rtl'
    },
    showClose: {
      type: Boolean,
      default: false
    },
    wrapperClosable: {
      type: Boolean,
      default: false
    },
    withHeader: {
      type: Boolean,
      default: true
    },
    withFooter: {
      type: Boolean,
      default: true
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    size: {
      type: String
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    beforeClose: { type: Function },
    cancelText: {
      default: '取 消'
    },
    confirmText: {
      default: '确 定'
    }
  },
  components: {
    [Drawer.name]: Drawer,
    [Button.name]: Button
  },
  data() {
    return {}
  },
  computed: {
    drawerVisible: {
      get() {
        return this.visible
      },
      set(v) {
        this.$emit('update:visible', v)
      }
    }
  },
  methods: {
    onConfirm() {
      this.$emit('confirm')
    },
    onCancel() {
      const cb = () => {
        this.drawerVisible = false
        this.$emit('cancel')
      }
      // 如果有 beforeClose
      if (this.beforeClose) {
        this.beforeClose(cb)
        return
      }
      // 否则直接执行关闭
      cb()
    }
  }
}
</script>
<style lang="scss" scoped>
.ein-drawer {
  .ein-drawer_body-wrapper {
    padding: 20px;
  }
  /deep/.el-drawer__header {
    & > :first-child {
      font-size: 18px;
      font-weight: 700;
      color: #303133;
    }
    border-bottom: 1px solid #dee2ed;
  }
  /deep/.el-drawer__body {
    height: calc(100% - 63px);
    display: flex;
    flex-direction: column;
    .el-scrollbar {
      flex: 1;
    }
    .drawer-footer {
      width: 100%;
      height: 65px;
      display: flex;
      // justify-content: space-around;
      align-items: center;
      box-shadow: 7px 0px 14px 0px rgba(41, 57, 73, 0.15);
      padding: 0 20px;
      .el-button {
        height: 32px;
        width: 90px;
      }
    }
  }
  /deep/.el-drawer {
    outline: none;
    .el-drawer__header {
      padding: 20px;
      margin: 0;
    }
  }
}
</style>
