import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
console.log()

let info = JSON.parse(window.localStorage.getItem('info'))

//info = null
let state = {
  info: info ? info : { title: '', countLists: 0, select: { list: -1, item: -1 } },
  lists: []
}

for (let i = 0; i < state.info.countLists; i++)
  state.lists.push(JSON.parse(window.localStorage.getItem(`list_${i}`)))

state.login = {
  uid: ''
}

export default new Vuex.Store({
  state: state,
  mutations: {
    init(state) {
      console.log('init store')
      let data = JSON.parse(localStorage.getItem('lists'))
      if (data) {
        state.info = data.info
        state.lists = data.lists
        state.login = data.login
      } else {
        state.info = { title: '', countLists: 0, select: { list: -1, item: -1 } }
        state.lists = []
      }

      if (!state.login) { return; }
      firebase.database().ref('user_' + state.login.uid + '/lists')
        .once('value', function (snapshot) {
          let val = snapshot.val();
          if (val != null) {
            state.info = val.info || { title: '', countLists: 0, select: { list: -1, item: -1 } };
            state.lists = val.lists || [];
          } else {
            state.info = { title: '', countLists: 0, select: { list: -1, item: -1 } };
            state.lists = []
          }
        }); //*/
    },
    newList(state, data) {
      let now = new Date();
      let list = {}
      list.info = data.info
      list.info.complete = false
      list.times = { create: now, update: '', complete: '', createItem: '', updateItem: '', removeItem: '', completeItem: '' }
      list.items = []
      state.lists.push(list);
      state.info.countLists = state.lists.length;
      state.info.select.list = state.lists.length - 1;
      state.info.select.item = -1;
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
  },
  actions: {
    login(store, data) {
      store.state.login = data
      localStorage.setItem('lists', JSON.stringify(store.state));
      store.commit('init');
    },
    signout(store) {
      console.log('sign out')
      store.state.info = { title: '', countLists: 0, select: { list: -1, item: -1 } };
      store.state.lists = []
      store.state.login = firebase.auth().currentUser;
      localStorage.setItem('lists', JSON.stringify(store.state))
    },
    save(store) {
      console.log('full save')
      store.state.lists = store.state.lists.map(list => {
        list.items = list.items.filter((list, index) => typeof (index) == 'number');
        return list
      })
      localStorage.setItem('lists', JSON.stringify(store.state));
      if (store.state.login && store.state.login.uid) {
        firebase.database().ref('user_' + store.state.login.uid + '/lists').set({ info: store.state.info, lists: store.state.lists }); //*/}
      }
    },
    signUp(state, User) {
      console.log('sign up actions')
      return firebase.auth().createUserWithEmailAndPassword(User.Login, User.Pass)
    },
    newList(store, props) {
      console.log('save info');
      store.commit('newList', props);
      store.dispatch('save');
    },
    updateListInfo(store, props) {
      store.commit('updateListInfo', props);
    },
    removeList(store, props) {
      store.commit('removeList', props);
      store.dispatch('save');
    },
    saveList(store, props) {
      console.log('save list');
      store.dispatch('save');
    },
    // Работа с пунктами
    newItem(store, props) {
      store.commit('newItem', props)
      store.dispatch('saveList', props)
    },
    updateItem(store, props) {
      store.commit('updateItem', props)
      store.dispatch('saveList', props)
    },
    removeItem(store, props) {
      store.commit('removeItem', props)
      store.dispatch('saveList', props)
    },
    completeItem(store, props) {
      store.commit('completeItem', props)
      store.dispatch('saveList', props)
    },
  },
  getters: {
    lists: state => {
      return state.lists
    }
  }
})