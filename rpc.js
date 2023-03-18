const crypto = require('crypto');
const readline = require('readline');

class Game {
    constructor(moves) {
        this.moves = moves;
        this.table = new Table(moves);
        this.winner = new WinnerSelector(moves);
        this.cryptoUtils = new CryptoUtils();
        this.key = this.cryptoUtils.generateSecureKey();
        this.computerMove = this.moves[crypto.randomInt(this.moves.length)];
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        this.start();
    }
  
    start() {
        if (this.moves.length % 2 === 0 || this.moves.length < 3 || new Set(this.moves).size !== this.moves.length) {
            console.log('Error: please provide an odd number of non-repeating moves (minimum 3).\nExample usage: node index.js rock paper scissors');
            return;
        }
        const hmac = this.cryptoUtils.generateHmac(this.key, this.computerMove);
        console.log(`\n** Welcome to the game. **\nComputer has chosen its move. HMAC: ${hmac}\nAvailable moves:`);
        this.moves.forEach((element, index) => console.log(`${index+1}: ${element}`));
        this.readUserInput();
    }
  
    readUserInput() {
        this.rl.question(`Please enter your move [Type a number to choose your move, "0" to exit, "help" for moves info]: `, (answer) => {
            if (answer === "0") {
            console.log("Exiting the game...\n");
            this.rl.close();
            } else {
            this.showResults(answer);
            }
        });
    }
  
    showResults(answer) {
        const userMove = this.moves[answer - 1];
        if (!userMove) {
            console.log(`\nInvalid move: ${answer}. Please try again.`);
            this.start();
        } else {
            console.log(`\n**Your move: ${userMove}**`);
            console.log(`Computer's move: ${this.computerMove}`);
            const result = this.winner.determineWinner(userMove, this.computerMove);
            if (result === "draw") {
            console.log("It's a draw!");
            } else if (result === "user") {
            console.log("You win!");
            } else {
            console.log("You lose!");
            }
            console.log(`HMAC key: ${this.key}\n`);
            this.rl.close();
        }
    }
  }
  
class WinnerSelector {
      constructor(moves) {
          this.moves = moves;
    }

    determineWinner(userMove, computerMove) {
        const index = this.moves.indexOf(userMove);
        const half = Math.ceil(this.moves.length / 2);
        const endIndex = index + half > this.moves.length ? half - (this.moves.length - index) : index + half;
        const winningMoves = this.moves.slice(index + 1, endIndex);
        if (userMove === computerMove) {
            return "draw";
        } else if (winningMoves.includes(computerMove)) {
            return "computer";
        } 
        return "user";    
    }
  }
  
class CryptoUtils {
    generateSecureKey() {
        return crypto.randomBytes(32).toString('hex');
    }
    
    generateHmac(key, data) {
        const hmac = crypto.createHmac('sha3-256', key);
        hmac.update(data);
        return hmac.digest('hex');
    }
  }

class Table {
          constructor(moves) {
          this.moves = moves;
    }
}

const moves = process.argv.slice(2);    
const game = new Game(moves);
