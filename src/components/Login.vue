<template>
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
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        FormLogin: false,
        Login: 'razrab@mail.ru',
        Pass: '111111',
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
</style>