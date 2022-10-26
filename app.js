function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
      specialBar: 0,
    };
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        // a draw
        this.winner = "draw";
      } else if (value <= 0) {
        //player loses
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // a draw
        this.winner = "draw";
      } else if (value <= 0) {
        //player wins
        this.winner = "player";
      }
    },
  },
  methods: {
    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(5, 12);
      this.monsterHealth -= attackValue;
      this.specialBar = this.specialBar + 25;
      this.addLogMessage("player", "attack", attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const monsterAttackValue = getRandomValue(8, 15);
      this.playerHealth -= monsterAttackValue;
      this.addLogMessage("monster", "monster-attack", monsterAttackValue);
    },
    specialAttack() {
      this.currentRound++;
      const specialValue = getRandomValue(13, 22);
      this.monsterHealth -= specialValue;
      this.addLogMessage("player", "special-attack", specialValue);
      this.attackPlayer();
      this.specialBar = 0;
    },
    healPlayer() {
      this.currentRound++;
      const castHeal = getRandomValue(10, 16);
      if (this.playerHealth + castHeal > 100) {
        this.player = 100;
      } else {
        this.playerHealth += castHeal;
        this.addLogMessage("player", "heal", castHeal);
      }
      this.attackPlayer();
    },
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.winner = null;
      this.logMessages = [];
      this.specialBar = 0;
    },
    surrender() {
      this.winner = "monster";
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    useSpecialAttack() {
      return this.specialBar !== 100;
    },
    specialbarStyles() {
      if (this.specialBar < 0) {
        return { width: "0%" };
      }
      return { width: this.specialBar + "%" };
    },
  },
});

app.mount("#game");
