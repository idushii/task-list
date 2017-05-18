<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="card" :class="{'active-select': select.list == -1}" id="head">
        <div class="card-content" style="min-height: 85px;">
          <span class="card-title center">{{isLogin ? 'Списки' : ''}} {{Progress}}
            <div class="waves-effect waves-light btn-flat left tooltipped" @click="userLogin" data-tooltip="Войти / выйти из системы"><i class="fa title-list-check" :class="{'fa-sign-in' : !isLogin, 'fa-sign-out': isLogin}"></i></div>
            <div class="waves-effect waves-light btn-flat left" @click="openHelp">F1</div>
            <div class="waves-effect waves-light btn right tooltipped" @click="newList" v-if="isLogin" data-tooltip="Новый список"><i class="material-icons">add</i></div>
            <div class="waves-effect waves-light btn-flat right tooltipped" @click="setKeyboard" v-if="isLogin" data-tooltip="Режим ввода с клавиатуры и режим мобильного устройства"><i class="fa title-list-check" :class="{'fa-keyboard-o' : !hasKeyboard, 'fa-mobile': hasKeyboard}"></i></div>
          </span>
          <input type="text" @keydown="selectActive" @keyup="findShiftKey" id="keysLive" autofocus v-if="hasKeyboard">
        </div>
      </div>
    </div>
    <div class="col s12 lists-container">
      <List v-for="(list, index) in lists" :key="index" :num-list='index'></List>
    </div>
    <help></help>
    <div id="modal1" class="modal">
      <div class="modal-content">
        <div class="row">
          <div class="col s12"><h4>Войти</h4></div>
          <div class="input-field col s12">
            <input placeholder="" id="Login" type="text" v-model="Login" @keyup.enter="login" />
            <label for="Login">Login</label>
          </div>
          <div class="input-field col s12">
            <input placeholder="" id="Pass" type="password" v-model="Pass" @keyup.enter="login" />
            <label for="Pass">Pass</label>
          </div>
        </div>
        <div class="col s12" style="min-height: 65px;">
          <div class="waves-effect waves-light btn right" @click="login">Войти</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Lists',
    data() {
      return {
        lastFocus: -2,
        Shift: '',
        isLogin: false,
        FormLogin: false,
        Login: 'razrab@mail.ru',
        Pass: '111111',
        hasKeyboard: localStorage.getItem('hasKeyboard') == 'false' ? false : true
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
          this.save()
          setTimeout(() => {
            this.showList()
          }, 100)
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
        let selectList = this.select.list > -1 ? this.$children[this.select.list].$el : head;
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

        //console.log(`keyDown: ${event.key}`)
        if ((event.key == 'Tab') & !this.Shift) {
          this.select.list++;
          this.select.item = -1;
          if (selectList == (this.countLists - 1)) {
            this.select.list = -1;
          }
          this.showList()
          this.defaultEvent(event)
        }
        if (event.key == 'Tab' & this.Shift) {
          this.select.list--;
          this.select.item = -1;
          if (selectList == -1) {
            this.select.list = this.countLists - 1;
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
        if (event.key == 'F1') {
          this.openHelp();
          this.defaultEvent(event)
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
              this.$store.commit('signout')
            })
            .catch(err => {
              Materialize.toast(error.message, 5000)
            })
        }
      },
      login() {
        firebase.auth().signInWithEmailAndPassword(this.Login, this.Pass)
          .then(data => {
            Materialize.toast('Успешный вход', 5000)
            $('#modal1').modal('close');
            this.isLogin = true;
            this.FormLogin = false;
            this.$store.commit('login', data)
            this.$store.commit('init')
          })
          .catch(function(error) {
            Materialize.toast(error.message, 5000)
          });

      },
      save() {
        if (this.$store.state.login.uid) {
          firebase.database().ref('user_' + this.$store.state.login.uid + '/info').set(this.$store.state.info); //*/
          //console.log('save lists')
          firebase.database().ref('user_' + this.$store.state.login.uid + '/list_' + (this.lists.length - 1)).set(this.lists[this.lists.length - 1]); //*/
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
      }
    },
    mounted() {
      console.log('mounted lists')
      window.onclick = function(event) {
        //console.log('click')
        if (modal1.classList.value.indexOf('open') == -1) {
          $('#keysLive').trigger('focus');
        }
      }
      this.$store.commit('init')
      if (this.$store.state.login) {
        this.isLogin = true
      }
    },
    computed: {
      lists: function() {
        //console.log('update lists');
        //window.localStorage.setItem('info', JSON.stringify(this.$store.state.info));
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
      },
      countLists: function() {
        return this.lists.length;
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
    grid-template-columns: auto auto;
  }
  
  @media(max-width: 700px) {
    .lists-container {
      grid-template-columns: auto;
    }
  }
  
  @media(min-width: 1000px) {
    .lists-container {
      grid-template-columns: auto auto auto;
    }
  }
</style>