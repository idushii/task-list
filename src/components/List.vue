<template>
  <div class="card" id="List" :class="{'active-select': thisSelect}">
    <div class="card-content">
      <div class="row">
        <div class="col s10 card-title">
          <i class="fa title-list-check" :class="{'fa-square-o' : !this.info.complete, 'fa-check-square-o': this.info.complete}" aria-hidden="true" @click="checkList" v-if="progress != ''"></i>
          <span class="title-list" @click="rename">{{info.title}}</span>
        </div>
        <div class="col s2 card-title">
          <div class="waves-effect waves-light btn right" @click="newItem"><i class="material-icons">add</i></div>
        </div><br>
        <div v-for="(item, index) in items">
          <div class="col s12" :class="{'active-select-item': thisSelectItem(index)}">
            <i class="fa title-list-check" :class="{'fa-square-o' : !item.complete, 'fa-check-square-o': item.complete}" aria-hidden="true" @click="checkItem(item)"></i>
            <span class="title-item" @click="renameItem(item)">{{item.title}}</span>
            <div class="waves-effect waves-light btn-flat" @click="deleteItem(index)"><i class="material-icons">delete</i></div>
          </div>
        </div>
      </div>  
    </div>
    <div class="card-action">
      <div class="waves-effect waves-light btn-flat left" @click="remove"><i class="material-icons">delete</i></div>
      <span class="right progress-items"><b>{{progress}}</b></span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'List',
    props: ['num-list'],
    methods: {
      checkList() {
        this.info.complete = !this.info.complete;
        this.$store.commit('updateListInfo', this);
        for (let i = 0; i < this.items.length; i++) {
          this.checkItem(this.items[i], this.info.complete)
        }
        this.save()
      },
      rename() {
        let title = window.prompt('Как назвать список?', this.info.title)
        if (title) {
          this.info.title = title;
          this.$store.commit('updateListInfo', this);
          this.save()
        }
      },
      remove() {
        if (window.confirm('Удалить список?')) {
          this.$store.commit('removeList', this)
            //window.localStorage.removeItem(`list_${this.stateInfo.countLists}`)
          this.save()
        }
      },
      newItem() {
        let title = window.prompt('Как назвать подзадачу?', 'Новая подзадача')
        if (title) {
          this.$store.commit('newItem', {
            numList: this.numList,
            title
          });
          this.checkItem({
            complete: false,
            times: {}
          })
          this.save()
          this.$parent.showList()
        }
      },
      checkItem(item, isCheck = null) {
        if (isCheck) {
          item.complete = isCheck;
        } else {
          item.complete = !item.complete;
          let flagAll = true;
          let flagOnce = false;
          for (let i = 0; i < this.items.length; i++) {
            if (!this.items[i].complete) flagAll = false
            if (this.items[i].complete) flagOnce = true
          }
          if (flagAll || flagOnce) {
            this.info.complete = flagAll ? true : false;
            this.$store.commit('updateListInfo', this);
          }
        }
        this.$store.commit('updateItem', {
          numList: this.numList,
          item
        });
        this.save()
      },
      renameItem(item) {
        let title = window.prompt('Новый заголовок для подзадачи?', item.title)
        if (title) {
          item.title = title;
          this.$store.commit('updateItem', {
            numList: this.numList,
            item
          });
        }
      },
      deleteItem(index) {
        if (window.confirm('Удалить подзадачу?')) {
          this.$store.commit('removeItem', {
            numList: this.numList,
            numItem: index
          })
          this.save()
        }
      },
      save() {
        //console.log(`save list #${this.numList}`)
        this.list.items = this.list.items.filter((list, index) => typeof(index) == 'number');
        //window.localStorage.setItem(`list_${this.numList}`, JSON.stringify(this.list));
        if (this.$store.state.login.uid) {
          firebase.database().ref('user_' + this.$store.state.login.uid + '/list_' + this.numList).set(this.list); //*/
        }
      },
      thisSelectItem(numItem) {
        return this.$store.state.info.select.item == numItem
      }
    },
    data() {
      return {}
    },
    mounted() {
      console.log('mounted list')
    },
    computed: {
      list() {
        let list = this.$store.state.lists[this.numList];
        list = list ? list : {
          items: [],
          info: {},
          times: {}
        };

        if (list.items == undefined) list.items = [];
        //console.log(`list #${this.numList}`)
        //console.log(list)
        return list;
      },
      items() {
        //this.save()
        return this.list.items;
      },
      info() {
        return this.list.info;
      },
      progress() {
        let count = this.items.filter(item => item.complete).length;
        return (this.items.length > 0) ? ((this.items.length == count) ? 'done' : `${count}/${this.items.length}`) : ''
      },
      stateInfo() {
        return this.$store.state.info;
      },
      thisSelect() {
        return this.$store.state.info.select.list == this.numList
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card-action {
    min-height: 70px;
  }
  
  .title-list-check {
    position: relative;
    top: 3px;
    cursor: pointer;
    margin-right: 10px;
  }
  
  .title-list {
    border-bottom: 1px dashed black;
    cursor: pointer;
  }
  
  .title-item {
    /*top: 10px;
    position: relative;/**/
    border-bottom: 1px dashed black;
    cursor: pointer;
    padding-bottom: 2px;
  }
  
  .progress-items {
    font-size: 1.3rem;
    padding-top: 10px;
  }
  
  .card .card-action {
    background-color: transparent;
  }
  
  .active-select {
    background-color: rgba(0, 255, 255, 0.2);
  }
  
  .active-select-item {
    background-color: white;
  }
</style>