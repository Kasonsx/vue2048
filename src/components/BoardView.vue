<template>
    <v-touch v-on:swipeleft="onSwipeLeft"
            v-on:swiperight="onSwipeRight"
            v-on:swipeup="onSwipeUp"
            v-on:swipedown="onSwipeDown">
        <p>Score：{{ score }}<span style="float: right">Time:  {{ time }}s</span></p>
        <div class="board" tabIndex="1">
            <div v-for="r_item in board.cells" :key="r_item.key">
                <cell v-for="c_item in r_item" :key="c_item.key"></cell>
            </div>
            <tile-view v-for="tile in tiles" :tile="tile" :key="tile.id"></tile-view>
            <game-end-overlay :board="board" :on-restart="onRestart" :game-time="time" :game-score="score"></game-end-overlay>
            <game-start v-on:count-time="addTime"></game-start>
        </div>
        <br>
        <p>备注：PC端按F12调整大小,使用键盘方向键操作</p>
        
    </v-touch>
</template>

<script>
import Cell from "./Cell.vue";
import TileView from "./TileView.vue";
import GameEndOverlay from "./GameEndOverlay.vue";
import GameStart from "./GameStart.vue";
import { Board } from "../board";

export default {
  components: {
    Cell,
    TileView,
    GameEndOverlay,
    GameStart
  },
  data() {
    return {
      board: new Board(),
      score: 0,
      time: 0,
      timer: null,
    };
  },
  methods: {
    addTime() {
      this.timer = setInterval(() => {
        this.time += 1;
        if(this.board.hasWon() || this.board.hasLost()){
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000);
    },
    handleKeyDown(event) {
      if (this.board.hasWon()) {
        return;
      }
      if (event.keyCode >= 37 && event.keyCode <= 40) {
        event.preventDefault();
        var direction = event.keyCode - 37;
        this.board.move(direction);
        this.score = this.board.score;
      }
    },
    onRestart() {
      this.board = new Board();
      this.time = 0;
      this.addTime();
    },
    // 0 -> left, 1 -> up, 2 -> right, 3 -> down
    onSwipeLeft() {
      //alert("left");
      if (this.board.hasWon()) {
        return;
      }
      this.board.move(0);
      this.score = this.board.score;
    },
    onSwipeRight() {
      //alert("right");
      if (this.board.hasWon()) {
        return;
      }
      this.board.move(2);
      this.score = this.board.score;
    },
    onSwipeUp() {
      //alert("up");
      if (this.board.hasWon()) {
        return;
      }
      this.board.move(1);
      this.score = this.board.score;
    },
    onSwipeDown() {
      //alert("down");
      if (this.board.hasWon()) {
        return;
      }
      this.board.move(3);
      this.score = this.board.score;
    }
  },
  computed: {
    tiles() {
      return this.board.tiles.filter(tile => tile.value != 0);
    }
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleKeyDown.bind(this));
  }
};
</script>
