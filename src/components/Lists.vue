<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="card">
        <div class="card-content">
          <span class="card-title">Списки <div class="waves-effect waves-light btn right" @click="newList"><i class="material-icons">add</i></div></span>
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
      return {}
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
      }
    },
    mounted() {
      console.log('mounted lists')
        /*this.$store.commit('newList', {
          info: {
            title: 'sss'
          }
        })//*/
    },
    computed: {
      lists: function() {
        console.log('update lists');
        window.localStorage.setItem('info', JSON.stringify(this.$store.state.info));
        return this.$store.state.lists;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card-action {
    min-height: 70px;
  }
</style>