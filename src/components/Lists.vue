<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="card" id="head">
        <div class="card-content" style="min-height: 85px;">
          <span class="card-title center">{{isLogin ? `Списки` : ''}} {{Progress}}
            <div class="waves-effect waves-light btn-flat left tooltipped" @click="userLogin" data-tooltip="Войти / выйти из системы"><span class="hide-on-small-only">{{user}}</span> <i class="fa title-list-check hide-on-med-and-up" :class="{'fa-sign-in' : !isLogin, 'fa-sign-out': isLogin}"></i></div>
            <div class="waves-effect waves-light btn-flat left" @click="openHelp">F1</div>
            <div class="waves-effect waves-light btn right tooltipped" @click="newList" data-tooltip="Новый список"><i class="material-icons">add</i></div>
            <div class="waves-effect waves-light btn-flat right tooltipped" @click="setKeyboard" data-tooltip="Режим ввода с клавиатуры и режим мобильного устройства"><i class="fa title-list-check" :class="{'fa-keyboard-o' : !hasKeyboard, 'fa-mobile': hasKeyboard}"></i></div>
          </span>
          <input type="text" @keydown="selectActive" @keyup="findAddenKey" id="keysLive" autofocus v-if="hasKeyboard">
        </div>
      </div>
    </div>
    <div class="col s12 lists-container">
      <List v-for="(list, index) in lists" :key="index" :num-list='index' ref="list"></List>
    </div>
    <help ref="help"></help>
    <PDF ref="PDF"></PDF>
    <Login ref="Login"></Login>
  </div>
</template>

<script>
  export default {
    name: 'Lists',
    data() {
      return {
        lastFocus: -1,
        Shift: '',
        Cntrl: '',
        hasKeyboard: localStorage.getItem('hasKeyboard') == 'false' ? false : true,
      }
    },
    methods: {
      newList() {
        console.log('new list')
        let title = window.prompt('Заголовок?', 'Новый список')
        if (title) {
          this.$store.dispatch('newList', {
              info: {
                title
              }
            })
            //nextTick ?
          setTimeout(() => {
            this.showList()
          }, 100)
          return true;
        }
        return false;
      },
      defaultEvent(event) {
        event.preventDefault()
        event.stopPropagation();
        return false;
      },
      findAddenKey(event) {
        console.log('keyUp: ' + event.key)
        if (event.key == 'Shift') {
          this.Shift = false;
        }
        if (event.key == 'Control') {
          this.Cntrl = false;
        }
      },
      showList() {
        //console.log('show list')
        let selectList = this.select.list > -1 ? this.$refs.list[this.select.list].$el : head;
        let list = {
          top: selectList.offsetTop,
          height: selectList.offsetHeight
        }
        let screen = {
          top: window.scrollY,
          height: window.screen.height
        };

        if (list.top > screen.top || list.top + list.height < screen.top + screen.height) {
          window.scrollTo(0, list.top - 100)
        }
      },
      selectActive(event) {
        let selectList = this.select.list;
        let selectItem = this.select.item;

        if (event.key == 'Shift') this.Shift = true;
        if (event.key == 'Control') this.Cntrl = true;

        //console.log(`keyDown: ${event.key}`)
        if (event.key == 'Escape') {
          if (selectList == 0 & selectItem == -1) {
            this.select.list = -1;
          }
          if (selectList > 0 & selectItem == -1) {
            this.select.list = 0;
            this.showList()
          }
          if (selectList > -1) {
            if (selectItem > -1) {
              this.select.item = -1;
              this.showList()
            }
          }
          this.defaultEvent(event)
        }
        if (event.key == 'Insert') {
          if (!this.Cntrl & selectList > -1) {
            this.$refs.list[selectList].newItem()
          }
          if (this.Cntrl) {
            if (this.newList()) {
              this.select.list = this.lists.length - 1;
            }
            this.Cntrl = false;
          }
        }
        if (event.key == 'ArrowUp') {
          if (selectList > -1) {
            let oneItem = selectItem;
            let twoItem = selectItem > 0 ? selectItem - 1 : this.lists[selectList].items.length - 1;
            this.select.item = twoItem;
            if (this.Cntrl) {
              let itemSelect = this.$store.state.lists[selectList].items.splice(oneItem, 1)[0]
              this.$store.state.lists[selectList].items.splice(twoItem, 0, itemSelect)
            }
          }
        }
        if (event.key == 'ArrowDown') {
          if (selectList > -1) {
            let oneItem = selectItem;
            let twoItem = (selectItem + 1) % this.lists[selectList].items.length;
            this.select.item = twoItem;

            if (this.Cntrl) {
              let itemSelect = this.$store.state.lists[selectList].items.splice(oneItem, 1)[0]
              this.$store.state.lists[selectList].items.splice(twoItem, 0, itemSelect)
            }
          }
        }
        if (event.key == 'ArrowRight') {
          if (selectList == -1) {
            this.select.list = 0;
          }
          if (selectList > -1) {
            let oneList = selectList;
            let twoList = (selectList + 1) % this.lists.length;
            if (this.Cntrl) {
              let ListSelect = this.$store.state.lists.splice(oneList, 1)[0]
              this.$store.state.lists.splice(twoList, 0, ListSelect)
            }
            this.select.list = twoList;
            this.select.item = -1;
            this.showList()
          }
        }
        if (event.key == 'ArrowLeft') {
          if (selectList == -1) {
            this.select.list = 0;
          }

          if (selectList > -1) {
            let oneList = selectList;
            let twoList = selectList > 0 ? selectList - 1 : this.lists.length - 1;

            if (this.Cntrl) {
              let ListSelect = this.$store.state.lists.splice(oneList, 1)[0]
              this.$store.state.lists.splice(twoList, 0, ListSelect)
            }

            this.select.list = twoList;
            this.select.item = -1;
            this.showList()
          }
        }
        if (event.key == ' ') {
          if (selectList > -1) {
            if (selectItem == -1) {
              this.$refs.list[selectList].checkList()
            } else {
              this.$refs.list[selectList].checkItem(this.$refs.list[selectList].items[selectItem])
            }
          }
        }
        if (event.key == 'F1') {
          this.openHelp();
          this.defaultEvent(event)
        }
        if (event.key == 'F2') {
          if (selectList > -1) {
            if (selectItem == -1) {
              this.$refs.list[selectList].rename()
            } else {
              this.$refs.list[selectList].renameItem(this.$refs.list[selectList].items[selectItem])
            }
          }
        }
        if (event.key == 'Delete') {
          if (selectList > -1 && selectItem == -1) {
            this.$refs.list[selectList].remove()
            this.select.list = this.lists.length - 1;
          }
          if (selectList > -1 && selectItem > -1) {
            this.$refs.list[selectList].deleteItem(selectItem)
          }
        }
        if (event.key == 'p' || event.key == 'з') {
          console.log('print')
          this.$refs.PDF.print();
        }
        if (event.key == 'l' || event.key == 'д') {
          console.log('key login')
          this.userLogin()
        }
      },
      setKeyboard() {
        this.hasKeyboard = !this.hasKeyboard
        localStorage.setItem('hasKeyboard', this.hasKeyboard)
        if (!this.hasKeyboard) {
          this.select.list = -2;
          this.select.item = -1;
        }
      },
      openHelp() {
        $('#Help').modal('open')
      },
      userLogin() {
        console.log('userLogin')
        if (!this.isLogin) {
          $('#modal1').modal()
          $('#modal1').modal('open');
          Materialize.updateTextFields();
          this.FormLogin = true;
        } else {
          firebase.auth().signOut()
            .then(data => {
              Materialize.toast('Вышел из аккаунта', 5000)
              this.isLogin = false;
              this.$store.dispatch('signout')
            })
            .catch(err => {
              Materialize.toast(error.message, 5000)
            })
        }
      },

    },
    mounted() {
      console.log('mounted lists')
      window.onclick = function(event) {
        //console.log('click')
        if (modal1.classList.value.indexOf('open') == -1) {
          $('#keysLive').trigger('focus');
        }
      }
    },
    computed: {
      lists: function() {
        //console.log('update lists');
        //window.localStorage.setItem('info', JSON.stringify(this.$store.state.info));
        console.log(this.$store.state)
        return this.$store.getters.lists;
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
      },
      countLists: function() {
        return this.lists.length;
      },
      isLogin: function() {
        return this.$store.state.login && this.$store.state.login.uid != '' ? true : false
      },
      user: function() {
        return this.$store.getters.user
      }
    }
  }

  if ('ontouchstart' in document.documentElement) {
    $('#keysLive').hide()
    console.log('true')
  } else {
    console.log('false')
  }
  $(document).ready(function() {
    $('.tooltipped').tooltip({
      delay: 50,
      position: 'bottom'
    });
    $('#modal1').modal()
  });
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
  
  .lists-container {
    display: ms-grid;
    display: grid;
    grid-template-columns: 50% auto;
  }
  
  @media(max-width: 700px) {
    .lists-container {
      grid-template-columns: auto;
    }
  }
  
  @media(min-width: 1000px) {
    .lists-container {
      grid-template-columns: 33% 33% auto;
    }
  }
</style>