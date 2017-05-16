<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="card" :class="{'active-select': select.list == -1}">
        <div class="card-content">
          <span class="card-title">Списки <div class="waves-effect waves-light btn right" @click="newList"><i class="material-icons">add</i></div></span>
          <input type="text" @keydown.tab="selectActive" @keydown.esc="selectActiveEsc" id="keysLive">
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
      },
      selectActive(event) {
        this.select.list++;
        if (this.select.list == this.info.countLists) {
          this.select.list = -1;
        }
        console.log(`select active #${this.select.list}`)

        event.preventDefault()
        event.stopPropagation();
        return false;
      },
      selectActiveEsc(event) {
        this.select.list = -2;
        console.log(`select active #${this.select.list}`)

        event.preventDefault()
        event.stopPropagation();
        return false;
      }
    },
    mounted() {
      console.log('mounted lists')
      window.onclick = function(event, ee, dd) {
        $('#keysLive').trigger('focus');
      }
    },
    computed: {
      lists: function() {
        console.log('update lists');
        window.localStorage.setItem('info', JSON.stringify(this.$store.state.info));
        return this.$store.state.lists;
      },
      select: function() {
        return this.$store.state.info.select;
      },
      info: function() {
        return this.$store.state.info;
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