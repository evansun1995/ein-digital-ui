<template>
  <el-dialog
    class="ein-dialog"
    :class="{ 'ein-dialog_no-title': !title && !$slots.title }"
    :title="title"
    :visible.sync="dialogVisible"
    :width="width"
    :before-close="beforeClose"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :append-to-body="appendToBody"
    :destroy-on-close="destroyOnClose"
    :show-close="showClose"
    :custom-class="type"
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <slot></slot>
    <template #footer>
      <!-- 如果slot设置了底部栏 -->
      <slot v-if="$slots.footer" name="footer"></slot>
      <!-- 否则 -->
      <div v-else class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { Dialog, Button } from 'element-ui'
export default {
  name: 'einDialog',
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    title: {
      type: String,
      default: ''
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    width: {
      type: String
    },
    showClose: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    beforeClose: {
      type: Function
    },
    type: {
      type: String
    }
  },
  components: {
    [Dialog.name]: Dialog,
    [Button.name]: Button
  },
  data() {
    return {}
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(v) {
        this.$emit('update:visible', v)
      }
    }
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm')
    },
    handleCancel() {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss" scoped>
.ein-dialog {
  /deep/.el-dialog {
    margin-bottom: 0;
    &.ein-dialog_no-title {
      .el-dialog__header {
        display: none;
      }
    }
    .el-dialog__header {
      border-bottom: 1px solid #f4f4f4;
      padding: 20px;
      text-align: center;
      font-weight: 700;
      color: #333;
      &,
      .el-dialog__title {
        font-size: 20px;
      }
    }
    .el-dialog__body {
      padding: 25px 20px;
    }
    .el-dialog__footer {
      text-align: center;
      border-top: 1px solid #f4f4f4;
      padding: 20px;
      .el-button + .el-button {
        margin-left: 30px;
      }
    }
  }
}
/deep/.confirm {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto !important;
  width: 300px;
  height: 135px;
  .el-dialog__header {
    border: 0;
    text-align: left;
  }
  .el-dialog__footer {
    text-align: right;
    border: 0;
  }
  .el-dialog__body {
    display: none;
  }
}
</style>
