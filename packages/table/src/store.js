const Store = function(initialState = {}) {
  this.state = {
    tableInstanceArr: []
  }

  Object.assign(this.state, initialState)
}

Store.prototype.mutations = {
  async addTable(state, instance) {
    state.tableInstanceArr.push(instance)
  },
  async removeTable(state, instance) {
    let index = state.tableInstanceArr.indexOf(instance)
    state.tableInstanceArr.splice(index, 1)
  },
  async calcAllTableHeight(state) {
    state.tableInstanceArr.forEach((table) => {
      table.calcTableHeight(500)
    })
  }
}

Store.prototype.commit = function(name, ...args) {
  const mutations = this.mutations
  if (mutations[name]) {
    return mutations[name].apply(this, [this.state].concat(args))
  } else {
    throw new Error(`Action not found: ${name}`)
  }
}

export default new Store()
