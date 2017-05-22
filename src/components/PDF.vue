<template>
  <div class="PDF white" id="PDF">
    <ul class="collection with-header" v-for="list in lists">
      <li class="collection-header"><h4>{{list.info.title}}</h4></li>
      <li class="collection-item" v-for="item in list.items">{{item.complete ? '&#10003;' : '&#9744;'}}&nbsp;{{item.title}}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'PDF',
    data() {
      return {
        lists: this.$store.getters.lists
      }
    },
    methods: {
      print() {
        printJS('PDF', 'html')
      }
    },
    mounted() {
      //printJS('PDF', 'html')
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #PDF {
    height: calc(100% - 10px);
    position: absolute;
    top: 0px;
    left: -200%;
  }
</style>