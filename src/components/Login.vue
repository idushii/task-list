<template>
  <div id="modal1" class="modal">
    <div class="modal-content">
      <div class="row">
        <div class="col s12"><h4><span @click="changeForm('login')">Войти</span> / <span @click="changeForm('reg')">Зарегистрироваться</span></h4></div>
      </div>
      <transition name="fade" mode="out-in">
      <div class="row" v-if="typeForm == 'login'" key='formLogin'>
        <div class="input-field col s12">
          <input placeholder="" id="Login" type="text" v-model="Login" @keyup.enter="login" />
          <label for="Login">Login</label>
        </div>
        <div class="input-field col s12">
          <input placeholder="" id="Pass" type="password" v-model="Pass" @keyup.enter="login" />
          <label for="Pass">Pass</label>
        </div>
        <div class="col s12">
          <div class="waves-effect waves-light btn right" @click="login">Sign In</div>
        </div>
      </div>
      <div class="row" v-if="typeForm == 'reg'" key='formReg'>
        <div class="input-field col s12">
          <input placeholder="" id="Login" type="text" v-model="Login" @keyup.enter="Reg" />
          <label for="Login">Login</label>
        </div>
        <div class="input-field col s12">
          <input placeholder="" id="Pass" type="password" v-model="Pass" @keyup.enter="Reg" />
          <label for="Pass">Pass</label>
        </div>
        <div class="input-field col s12">
          <input placeholder="" id="Pass2" type="password" v-model="Pass2" @keyup.enter="Reg" />
          <label for="Pass2">Pass dbl</label>
        </div>
        <div class="col s12">
          <div class="waves-effect waves-light btn right" @click="Reg">Sign Up</div>
        </div>
      </div>
      </transition>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        FormLogin: false,
        Login: 'anonim@mail.ru',
        Pass: '111111',
        Pass2: '111111',
        typeForm: 'login'
      }
    },
    methods: {
      login() {
        firebase.auth().signInWithEmailAndPassword(this.Login, this.Pass)
          .then(data => {
            Materialize.toast('Успешный вход', 5000)
            $('#modal1').modal('close');
            this.$parent.isLogin = true;
            this.FormLogin = false;
            this.$store.commit('login', data)
            this.$store.commit('init')
          })
          .catch(function(error) {
            Materialize.toast(error.message, 5000)
          });
      },
      Reg() {
        if (this.Pass != this.Pass2) {
          Materialize.toast('Пароли не совпадают.', 5000)
          return;
        }
        let store = this.$store;
        this.$store.dispatch('signUp', this.$data)
          .then(function(data) {
            store.commit('login', data)
            store.commit('init', data)
            Materialize.toast('Успешная регистрация.', 5000)
            $('.modal').modal('close')
            $('#keysLive').trigger('focus');
          })
          .catch(function(error) {
            Materialize.toast(error.message, 5000)
          })
      },
      changeForm(type) {
        this.typeForm = type;
        this.$nextTick(function() {
          setTimeout(() => {
            Materialize.updateTextFields()
          }, 1000)
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    display: inline-block;
    margin: 0 10px;
  }
  
  a {
    color: #42b983;
  }
  
  .modal h4>span {
    border-bottom: dashed black 1px;
    cursor: pointer;
  }
  
  .modal .modal-content .row {
    margin-bottom: 0px;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s
  }
  
  .fade-enter,
  .fade-leave-to
  /* .fade-leave-active для <2.1.8 */
  
  {
    opacity: 0
  }
</style>