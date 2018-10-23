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
    },
    gameTime: {
      type: Number,
      required: true
    },
    gameScore: {
      type: Number,
      required: true
    }
  },
  computed: {
    show() {
      return this.board.hasWon() || this.board.hasLost();
    },
    contents() {
      let result = `Score: ${this.gameScore}\n Time: ${this.gameTime}\n`;
      if (this.board.hasWon()) {
        return result + "Good job!";
      } else if (this.board.hasLost()) {
        return result + "Game Over";
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
