<template>
  <div class="ein-tree" :class="{ 'is-all-empty': isAllEmpty }" :style="{ height: treeWrapperHeight }">
    <div v-if="filterable" class="tree-header flex">
      <el-input placeholder="输入关键词进行过滤" v-model="filterText" size="mini" clearable>
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <div :class="isIeExplorer ? 'tree-button-group is-ie-explorer flex' : 'tree-button-group flex'">
        <i
          class="icon"
          :class="isExpand ? 'el-icon-document-remove' : 'el-icon-document-add'"
          size="16"
          :title="isExpand ? '收起' : '展开'"
          @click="handleExpandCollapse"
        ></i>
        <i class="icon el-icon-refresh" :class="{ 'is-loading': loading }" size="16" title="刷新" @click="refresh"></i>
      </div>
    </div>
    <ein-scrollbar class="tree-scrollbar" :height="treeHeight" v-loading="loading" :style="{ marginTop: treeMarginTop + 'px' }">
      <template v-for="(data, idx) in finalGroupData">
        <el-tree
          ref="elTree"
          :key="idx"
          :style="{ background: filterable ? '#fafafa' : '' }"
          :data="data"
          :props="props"
          :default-expand-all="defaultExpandAll"
          :filter-node-method="filterNode"
          :load="load"
          :lazy="lazy"
          :show-checkbox="showCheckbox"
          :accordion="accordion"
          :node-key="nodeKey"
          :default-expanded-keys="defaultExpandedKeys"
          :highlight-current="highlightCurrent"
          :render-after-expand="renderAfterExpand"
          :render-content="renderContent"
          :check-on-click-node="checkOnClickNode"
          :auto-expand-parent="autoExpandParent"
          :check-strictly="checkStrictly"
          :current-node-key="currentNodeKey"
          :indent="indent"
          :icon-class="iconClass"
          :draggable="draggable"
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
          :expand-on-click-node="expandOnClickNode"
          :default-checked-keys="defaultCheckedKeys"
          :empty-text="emptyText"
          @node-click="handleNodeClick"
          @node-contextmenu="nodeContextmenu"
          @check-change="checkChange"
          @check="check"
          @current-change="currentChange"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
          @node-drag-start="nodeDragStart"
          @node-drag-enter="nodeDragEnter"
          @node-drag-leave="nodeDragLeave"
          @node-drag-over="nodeDragOver"
          @node-drag-end="nodeDragEnd"
          @node-drop="nodeDrop"
        >
          <!-- 作用域插槽：插槽prop -->
          <slot slot-scope="{ node, data }" :node="node" :data="data">
            <span class="custom-tree-node">
              <!-- 没有传递作用域插槽时使用默认的 -->
              <span class="el-tree-node__label" :title="node.label">
                {{ node.label }}
              </span>
            </span>
          </slot>
        </el-tree>
      </template>
    </ein-scrollbar>
  </div>
</template>
<script>
import { Tree } from 'element-ui'
import { getPXValue } from '../../../src/utils/index'
import einScrollbar from '../../scrollbar'
export default {
  name: 'einTree',
  props: {
    data: Array,
    load: {
      type: Function
    },
    lazy: {
      type: Boolean,
      default: false
    },
    accordion: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default: function () {
        return {
          children: 'children',
          label: 'label'
        }
      }
    },
    filterable: {
      type: Boolean,
      default: false
    },
    showMoreButton: {
      type: Boolean,
      default: false
    },
    iconClass: {
      type: String
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    defaultExpandedKeys: {
      type: Array
    },
    highlightCurrent: {
      type: Boolean,
      default: false
    },
    renderAfterExpand: {
      type: Boolean,
      default: true
    },
    renderContent: {
      type: Function
    },
    checkOnClickNode: {
      type: Boolean,
      default: false
    },
    autoExpandParent: {
      type: Boolean,
      default: true
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
    currentNodeKey: {
      type: [String, Number]
    },
    indent: {
      type: Number,
      default: 16
    },
    draggable: {
      type: Boolean,
      default: false
    },
    allowDrag: {
      type: Function
    },
    allowDrop: {
      type: Function
    },
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    defaultCheckedKeys: {
      type: Array,
      default() {
        return []
      }
    },
    emptyText: {
      default: '暂无数据'
    },
    height: {
      type: [String, Number],
      default: ''
    },
    defaultFilterText: {
      default: ''
    }
  },
  components: {
    [Tree.name]: Tree,
    [einScrollbar.name]: einScrollbar
  },
  data() {
    return {
      filterText: '',
      isExpand: this.defaultExpandAll,
      isIeExplorer: false,
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isAllEmpty: false,
      treeMarginTop: 10
    }
  },
  computed: {
    isGroupTree() {
      return this.data.length > 0 && Array.isArray(this.data[0])
    },
    finalGroupData() {
      if (this.isGroupTree) {
        return this.data
      } else {
        return [this.data]
      }
    },
    treeHeight() {
      return this.filterable ? 'calc( 100% - ' + (this.treeMarginTop + 28) + 'px )' : '100%'
    },
    treeWrapperHeight() {
      return getPXValue(this.height)
    }
  },
  methods: {
    getIsAllEmpty() {
      // 几个场景触发：1.首次挂载。2.树的数据改变。3.过滤树
      this.isAllEmpty = this.$refs.elTree.every((elTree) => elTree.isEmpty)
    },
    filterTree(keywords) {
      this.$refs.elTree.forEach((elTree) => elTree.filter(keywords))
      // 过滤是同步事件，过滤后主动判断是否为全空
      this.getIsAllEmpty()
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.props.label] && data[this.props.label].indexOf(value) !== -1
    },
    handleNodeClick(data, node, nodeComponent) {
      this.$emit('node-click', data, node, nodeComponent)
    },
    nodeContextmenu(event, data, node, nodeComponent) {
      this.$emit('node-contextmenu', event, data, node, nodeComponent)
    },
    checkChange(data, isChecked, hasChildChecked) {
      this.$emit('check-change', data, isChecked, hasChildChecked)
    },
    check(data, checkedObj) {
      this.$emit('check', data, checkedObj)
    },
    currentChange(data, node) {
      this.$emit('current-change', data, node)
    },
    nodeExpand(data, node, nodeComponent) {
      this.$emit('node-expand', data, node, nodeComponent)
    },
    nodeCollapse(data, node, nodeComponent) {
      this.$emit('node-collapse', data, node, nodeComponent)
    },
    nodeDragStart(node, event) {
      this.$emit('node-drag-start', node, event)
    },
    nodeDragEnter(dragNode, enterNode, event) {
      this.$emit('node-drag-enter', dragNode, enterNode, event)
    },
    nodeDragLeave(dragNode, enterNode, event) {
      this.$emit('node-drag-leave', dragNode, enterNode, event)
    },
    nodeDragOver(dragNode, enterNode, event) {
      this.$emit('node-drag-over', dragNode, enterNode, event)
    },
    nodeDragEnd(dragNode, endNode, position, event) {
      this.$emit('node-drag-end', dragNode, endNode, position, event)
    },
    nodeDrop(dragNode, endNode, position, event) {
      this.$emit('node-drop', dragNode, endNode, position, event)
    },
    // 树状菜单的全部展开和收起
    handleExpandCollapse() {
      this.isExpand = !this.isExpand
      let elTreeArr = this.$refs.elTree
      elTreeArr.forEach((elTree) => {
        let allNodes = elTree.store._getAllNodes()
        for (var i = 0; i < allNodes.length; i++) {
          allNodes[i].expanded = this.isExpand
        }
      })
    },
    afterRefresh() {
      this.loading = false
      this.isExpand = this.defaultExpandAll
      this.filterText = ''
    },
    refresh() {
      this.loading = true
      let timer =
        typeof window === 'object' &&
        window.setTimeout(() => {
          this.afterRefresh()
        }, 5000)
      this.$emit('refresh', () => {
        this.afterRefresh()
        typeof window === 'object' && window.clearTimeout(timer)
      })
    },
    getCheckedNodes() {
      var elTreeArr = this.$refs.elTree
      let checkedNodes = elTreeArr.reduce((arr, elTree) => {
        arr.push(elTree.getCheckedNodes())
        return arr
      }, [])
      return this.isGroupTree ? checkedNodes : checkedNodes[0]
    },
    getCheckedNodesWidthHalf() {
      var elTreeArr = this.$refs.elTree
      let checkedNodes = elTreeArr.reduce((arr, elTree) => {
        arr.push([...elTree.getCheckedNodes(), ...elTree.getHalfCheckedNodes()])
        return arr
      }, [])
      return this.isGroupTree ? checkedNodes : checkedNodes[0]
    }
  },
  watch: {
    filterText(val) {
      this.filterTree(val)
    },
    defaultCheckedKeys(valArr) {
      this.$nextTick(() => {
        this.$refs.elTree.forEach((elTree, idx) => elTree.setCheckedKeys(valArr[idx]))
      })
    },
    finalGroupData() {
      // 数据改变时主动判断是否为全空
      this.getIsAllEmpty()
    },
    defaultFilterText(t) {
      this.filterText = t
    }
  },
  mounted() {
    if ((typeof window === 'object' && !!window.ActiveXObject) || (typeof window === 'object' && 'ActiveXObject' in window)) {
      this.isIeExplorer = true
    }
    // 初始化时主动判断是否为全空
    this.getIsAllEmpty()
    if (this.defaultFilterText) {
      this.filterText = this.defaultFilterText
    }
  }
}
</script>
<style lang="scss" scoped>
.ein-tree {
  div[aria-invalid='true'] >>> .el-input__inner,
  div[aria-invalid='true'] >>> .el-input__inner:focus {
    border-color: #f56c6c;
  }
  .is-ie-explorer {
    margin-right: 25px;
  }

  @keyframes roate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  div.tree-button-group .icon {
    cursor: pointer;
    display: inline;
    // font-weight: bold;
    margin-right: 10px;
    font-size: 16px;
    color: #606266;
    &.is-loading {
      animation: roate linear 2s infinite;
      color: #bcbec2;
      cursor: not-allowed;
    }
  }

  div.tree-button-group i:hover {
    color: lightcoral;
  }

  div.tree-header {
    min-height: 28px;
  }

  .tree-button-group {
    margin-left: 10px;
    display: flex;
    align-items: center;
  }

  div.tree-header >>> .el-input__inner {
    border-width: 0;
    padding-right: 0;
  }

  /deep/.custom-tree-node {
    width: calc(100% - 40px);
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    .ein-icon-svg {
      visibility: hidden;
    }
    &:hover .ein-icon-svg {
      visibility: visible;
    }
    .el-tree-node__label {
      display: block;
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  /deep/ .el-tree__empty-block {
    display: none;
  }
}
.is-all-empty {
  // 全空时候展示第一个数的空文字
  .el-tree:first-child {
    /deep/ .el-tree__empty-block {
      display: block;
    }
  }
}
</style>
