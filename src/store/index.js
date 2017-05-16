import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
console.log()

let info = JSON.parse(window.localStorage.getItem('info'))

let state = {
  info: info ? info : { title: '', countLists: 0, select: { list: -1, item: 0 } },
  lists: []
}

for (let i = 0; i < state.info.countLists; i++)
  state.lists.push(JSON.parse(window.localStorage.getItem(`list_${i}`)))

export default new Vuex.Store({
  state: state,
  mutations: {
    newList(state, data) {
      let now = new Date();
      let list = {}
      list.info = data.info
      list.info.complete = false
      list.times = { create: now, update: '', complete: '', createItem: '', updateItem: '', removeItem: '', completeItem: '' }
      list.items = []
      state.lists.push(list);
      state.info.countLists = state.lists.length;
    },
    updateListInfo(state, data) {
      state.lists[data.numList].times.update = new Date();
      state.lists[data.numList].info = data.info
    },
    removeList(state, data) {
      state.lists.splice(data.numList, 1)
      state.info.countLists = state.lists.length;
    },
    newItem(state, data) {
      let now = new Date();
      let item = {};
      item.times = { create: now, update: '', complete: '' }
      item.complete = false;
      item.title = data.title;
      state.lists[data.numList].items.push(item)
      state.lists[data.numList].times.createItem = now;
    },
    updateItem(state, data) {
      let now = new Date();
      data.item.times.update = now;
      state.lists[data.numList].items[data.numItem] = data.item;
      state.lists[data.numList].times.update = now;
    },
    removeItem(state, data) {
      let now = new Date();
      state.lists[data.numList].items.splice(data.numItem, 1)
      state.lists[data.numList].times.removeItem = now;
    },
    completeItem(state, data) {
      let now = new Date();
      let list = state.lists[data.numList];
      list.items[data.numItem] = data.item;
      list.items[data.numItem].times.complete = now;
      let flag = true;
      for (let i = 0; i < list.length - 1; i++) {
        if (list[i].times.complete == '') {
          flag = false;
        }
      }
      if (flag) {
        list.times.complete = now;
      }
    },
  }
})