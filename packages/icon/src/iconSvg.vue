<template>
  <span class="ein-icon-svg">
    <svg class="icon" aria-hidden="true" :style="{ fontSize: size + 'px' }" @click="handleClick">
      <title>{{ title }}</title>
      <use :xlink:href="'#' + icon"></use>
    </svg>
  </span>
</template>
<script>
export default {
  name: 'einIconSvg',
  props: {
    icon: {
      type: String,
      required: true
    },
    size: {},
    title: {}
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>
<style lang="scss" scoped>
.ein-icon-svg {
  display: inline-block;
}
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
