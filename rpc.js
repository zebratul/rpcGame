const crypto = require('crypto');
const readline = require('readline');
const { AsciiTable3 } = require('ascii-table3');

class Game {
    constructor(moves) {
        this.moves = moves;
        this.winner = new WinnerSelector(moves);
        this.tableGenerator = new TableGenerator(moves, this.winner);
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
            } else if (answer == "help") {
                // console.log(this.tableGenerator.generate());
                this.tableGenerator.printTable();
                this.start();
            }
            else {
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
        const totalMoves = this.moves.length;
        const half = Math.floor(totalMoves / 2);
        let endIndex = (index + half) % totalMoves;
      
        if (index === totalMoves - 1) {
          endIndex = half - 1;
        }
      
        const winningMoves = [];
        if (endIndex > index) {
          winningMoves.push(...this.moves.slice(index + 1, endIndex + 1));
        } else {
          winningMoves.push(...this.moves.slice(index + 1), ...this.moves.slice(0, endIndex + 1));
        }
      
        if (userMove === computerMove) {
          return "draw";
        } else if (winningMoves.includes(computerMove)) {
          return "computer";
        } else {
          return "user";
        }
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

class TableGenerator {
    constructor(moves, winnerSelector) {
      this.moves = moves;
      this.winnerSelector = winnerSelector;
      this.table = new AsciiTable3('Moves and Results');
      this.table.setHeading('', ...moves);
      this.fillTable();
    }
  
    fillTable() {
      for (let i = 0; i < this.moves.length; i++) {
        const row = [this.moves[i]];
        for (let j = 0; j < this.moves.length; j++) {
          if (i === j) {
            row.push('-');
          } else {
            const result = this.winnerSelector.determineWinner(this.moves[i], this.moves[j]);
            row.push(result === 'user' ? 'win' : 'lose');
          }
        }
        this.table.addRow(...row);
      }
    }
  
    printTable() {
      console.log(this.table.toString());
    }
  }
  

const moves = process.argv.slice(2);    
const game = new Game(moves);
