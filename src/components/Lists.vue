<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="card" :class="{'active-select': select.list == -1}" id="head">
        <div class="card-content">
          <span class="card-title">Списки {{Progress}}<div class="waves-effect waves-light btn right" @click="newList"><i class="material-icons">add</i></div></span>
          <input type="text" @keydown="selectActive" @keyup="findShiftKey" id="keysLive" @focusout="focusout" @focusin="focus" autofocus>
          <i class="fa title-list-check" :class="{'fa-sign-in' : true, 'fa-check-square-o': false}" aria-hidden="true" @click="checkList" v-if="progress != ''"></i>
        </div>
      </div>
    </div>
    <div class="col s12 m6" v-for="(list, index) in lists">
      <List :num-list='index'></List>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Lists',
    data() {
      return {
        lastFocus: -1,
        Shift: ''
      }
    },
    methods: {
      newList() {
        console.log('new list')
        let title = window.prompt('Заголовок?', 'Новый список')
        if (title) {
          this.$store.commit('newList', {
            info: {
              title
            }
          })
        }
      },
      defaultEvent(event) {
        event.preventDefault()
        event.stopPropagation();
        return false;
      },
      findShiftKey(event) {
        //console.log('keyUp: ' + event.key)
        if (event.key == 'Shift') {
          this.Shift = false;
        }
      },
      showList() {
        //console.log('show list')
        let selectList = this.select.list != -1 ? this.$children[this.select.list].$el : head;
        let list = {
          top: selectList.offsetTop,
          height: selectList.offsetHeight
        }
        let screen = {
          top: window.scrollY,
          height: window.screen.height
        };

        if (list.top > screen.top || list.top + list.height < screen.top + screen.height) {
          window.scrollTo(0, list.top)
        }
      },
      selectActive(event) {
        let selectList = this.select.list;
        let selectItem = this.select.item;

        if (event.key == 'Shift') this.Shift = true;

        //console.log(`keyDown: ${event.key}`)
        if ((event.key == 'Tab') & !this.Shift) {
          this.select.list++;
          this.select.item = -1;
          if (selectList == (this.info.countLists - 1)) {
            this.select.list = -1;
          }
          this.showList()
          this.defaultEvent(event)
        }
        if (event.key == 'Tab' & this.Shift) {
          this.select.list--;
          this.select.item = -1;
          if (selectList == -1) {
            this.select.list = this.info.countLists - 1;
          }
          this.showList()
          this.defaultEvent(event)
        }
        if (event.key == 'Escape') {
          if (selectList == -1) {
            this.select.list = -2;
          }
          if (selectList > -1) {
            if (selectItem > -1) {
              this.select.item = -1;
              this.showList()
            } else {
              this.select.list = -1;
              this.select.item = -1;
            }
          }
          this.defaultEvent(event)
        }
        if (event.key == 'Insert') {
          if (selectList == -1) {
            this.newList()
            this.select.list = this.lists.length - 1;
          }
          if (selectList > -1) {
            this.$children[selectList].newItem()
          }
          this.defaultEvent(event)
        }
        if (event.key == 'ArrowDown' || event.key == 'ArrowRight') {
          if (selectList > -1) {
            this.select.item++;
            if (selectItem > (this.lists[selectList].items.length - 2)) {
              this.select.item = 0;
            }
          }
        }
        if (event.key == 'ArrowUp' || event.key == 'ArrowLeft') {
          if (selectList > -1) {
            this.select.item--;
            if (selectItem < 1) {
              this.select.item = this.lists[selectList].items.length - 1;
            }
          }
        }
        if (event.key == ' ') {
          if (selectList > -1) {
            if (selectItem == -1) {
              this.$children[selectList].checkList()
            } else {
              this.$children[selectList].checkItem(this.$children[selectList].items[selectItem])
            }
          }
        }
        if (event.key == 'F2') {
          if (selectList > -1) {
            if (selectItem == -1) {
              this.$children[selectList].rename()
            } else {
              this.$children[selectList].renameItem(this.$children[selectList].items[selectItem])
            }
          }
        }
        if (event.key == 'Delete') {
          if (selectList > -1 && selectItem == -1) {
            this.$children[selectList].remove()
            this.select.list = this.lists.length - 1;
          }
          if (selectList > -1 && selectItem > -1) {
            this.$children[selectList].deleteItem(selectItem)
          }
        }
      },
      focusout() {
        this.lastFocus = this.select.list;
        this.select.list = -2;
      },
      focus() {
        this.select.list = this.lastFocus;
      }
    },
    mounted() {
      console.log('mounted lists')
      window.onclick = function(event, ee, dd) {
        $('#keysLive').trigger('focus');
      }
      this.$store.commit('init')
    },
    computed: {
      lists: function() {
        //console.log('update lists');
        window.localStorage.setItem('info', JSON.stringify(this.$store.state.info));

        firebase.database().ref('users/lists').set({
          info: this.$store.state.info,
          lists: this.$store.state.lists
        }); //*/
        //console.log(this.$store.state)
        return this.$store.state.lists;
      },
      select: function() {
        return this.$store.state.info.select;
      },
      info: function() {
        return this.$store.state.info;
      },
      Progress: function() {
        let countComplete = this.lists.filter(list => list.info.complete).length;
        let countLists = this.lists.length;
        return (countLists > 0) ? ((countComplete == countLists) ? 'done' : `${countComplete}/${countLists}`) : ''
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card-action {
    min-height: 70px;
  }
  
  .active-select {
    background-color: rgba(0, 255, 255, 0.2);
  }
  
  #keysLive {
    position: fixed;
    top: -100px;
  }
</style>