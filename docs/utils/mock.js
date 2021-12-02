const mock = {
  mockTableData(query) {
    console.log('query', query)
    return new Promise((resolve) => {
      // 因为vuepress使用NodeJS进行ssr，NodeJS中不存在 window，需要做兼容
      typeof window === 'object' &&
        window.setTimeout(() => {
          resolve({
            list: Array(query.size)
              .fill('')
              .map((item, idx) => {
                return { date: `2016-05-${idx + 1}`, name: `王小虎${idx + query.page}`, address: `上海市普陀区金沙江路 151${idx} 弄` }
              }),
            total: 100
          })
        }, 2000)
    })
  }
}

export default mock
