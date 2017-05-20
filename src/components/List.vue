<template>
  <div class="card list" id="List" :class="{'active-select': thisSelect}" @click="selectByClick">
    <div class="card-content">
      <div class="row title-list">
        <div class="col s1 card-title">
          <i class="fa" :class="{'fa-square-o' : !this.info.complete, 'fa-check-square-o': this.info.complete}" aria-hidden="true" @click="checkList"></i>
        </div>
        <div class="col s9 card-title" @click="rename">
          {{info.title}}
        </div>
        <div class="col s2 waves-effect waves-light btn" @click="newItem"><i class="material-icons">add</i></div>
      </div>
      <transition-group name="list" tag="div">
      <div class="row line-item " v-for="(item, index) in items" v-bind:key="index" :class="{'active-select-item': thisSelectItem(index)}">
        <div class="col s1 title-list-check">
          <i class="fa" :class="{'fa-square-o' : !item.complete, 'fa-check-square-o': item.complete}" aria-hidden="true" @click="checkItem(item)"></i>
        </div>
        <div class="col s9 title-item truncate" @click="renameItem(item)">
          {{item.title}}
        </div>
        <div class="col s1 title-list-delete">
          <i class="fa fa-trash" aria-hidden="true" @click="deleteItem(index)"></i>
        </div>
      </div>
      </transition-group>
    </div>
    <div class="card-action">
      <div class="row">
        <div class="col s1 waves-effect waves-light btn-flat left" @click="remove"><i class="material-icons">delete</i></div>
        <div class="col s11 progress-items center-align"><b>{{progress}}</b></div>
      </div>
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
        if (window.confirm(`Удалить подзадачу?`)) {
          this.$store.commit('removeItem', {
            numList: this.numList,
            numItem: index
          })
          this.save()
        }
      },
      save() {
        //console.log(`save list #${this.numList}`)
        //window.localStorage.setItem(`list_${this.numList}`, JSON.stringify(this.list));
        this.list.items = this.list.items.filter((list, index) => typeof(index) == 'number');
        if (this.$store.state.login.uid) {
          firebase.database().ref('user_' + this.$store.state.login.uid + '/list_' + this.numList).set(this.list); //*/
        }
      },
      thisSelectItem(numItem) {
        return this.$store.state.info.select.item == numItem
      },
      selectByClick() {
        if (this.$parent.hasKeyboard) {
          this.$store.state.info.select.list = this.numList;
          this.$store.state.info.select.item = -1;
        }
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
    width: 20px;
  }
  
  .title-list-delete {
    position: relative;
    top: 3px;
    cursor: pointer;
    margin-left: 10px;
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
  
  #List {
    margin: 5px;
    display: -ms-grid;
    display: grid;
    grid-template-rows: auto 70px;
    grid-template-columns: auto;
  }
  
  .title-list {
    cursor: pointer;
    margin-bottom: 0px;
    text-align: center;
  }
  
  .item-container {
    margin-bottom: 3px;
  }
  
  .line-item {
    margin-bottom: 0px;
    padding: 3px;
  }
  
  .list-enter-active,
  .list-leave-active {
    transition: all 200ms;
  }
  
  .list-enter,
  .list-leave-to {
    opacity: 0;
    /*transform: translateX(30px);*/
  }
</style>