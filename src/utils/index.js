// 将传入的数值转换成像素值
export const getPXValue = (value) => {
  // 特殊判断 0
  if (value === 0) return '0px'
  // 如果没传返回空
  if (!value) return ''
  // 如果是 完整的 px 值
  if (/^\d+(\.\d+)?px$/i.test(value)) return value
  // 如果不是数字
  value = Number(value)
  if (isNaN(value)) return ''
  // 否则拼接 px
  return `${value}px`
}
