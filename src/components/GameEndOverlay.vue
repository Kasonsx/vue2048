<template>
    <div class="overlay" v-show="show">
        <p class="message">{{ contents }}</p>
        <button class="tryAgain" @click="restart">Try again</button>
    </div>
</template>

<script>
export default {
  props: {
    board: {
      type: Object,
      required: true
    },
    onRestart: {
      type: Function,
      required: true
    }
  },
  computed: {
    show() {
      return this.board.hasWon() || this.board.hasLost();
    },
    contents() {
      if (this.board.hasWon()) {
        return "Good job!";
      } else if (this.board.hasLost()) {
        return "Game Over";
      } else {
        return "";
      }
    }
  },
  methods: {
    restart() {
      this.onRestart && this.onRestart();
    }
  }
};
</script>
