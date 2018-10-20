<template>
    <div class="overlay" v-show="isStart">
        <p class="message">Have Fun!</p>
        <button class="tryAgain" @click="start">Start!</button>
    </div>
</template>

<script>
export default {
  data(){
      return {
          isStart: true,
      }
  },
  props: {
    
  },
  methods: {
    restart() {
      this.onRestart && this.onRestart();
    },
    start() {
      this.isStart = false;
      this.$emit('count-time');
    }
  }
};
</script>
