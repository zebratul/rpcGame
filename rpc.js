const crypto = require('crypto');
const readline = require('readline');

class Game {
    constructor(moves) {
        this.moves = moves;
        // this.table = new Table(moves);
        this.winner = new Winner(moves);
        this.keyGenerator = new CryptoUtils();
        this.start();
      }
  
    start() {
        if (moves.length % 2 === 0 || moves.length < 3 || new Set(moves).size !== moves.length) {
            console.log('Error: please provide an odd number of non-repeating moves (minimum 3).');
            console.log('Example usage: node index.js rock paper scissors');
        return;
        }
        const computerMove = this.moves[Math.floor(Math.random() * this.moves.length)];
    //   const key = this.keyGenerator.generateKey();
    //   const hmac = crypto.createHmac("sha3-256", key);
    //   hmac.update(computerMove);
        console.log(`** Welcome to the game. **`);
        console.log(`Computer has chosen it's move. HMAC: TBD `);
        console.log(`Available moves:`);
        moves.forEach((element, index) => console.log(`${index+1}: ${element}`));

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
  
        rl.question(`Please, enter your move ["0" to exit, "help" for moves info]: `, (answer) => {
            if (answer === "0") {
                console.log("Exiting the game...");
                rl.close();
        } else {
            const userMove = this.moves[answer - 1];
            if (!userMove) {
                console.log(`Invalid move: ${answer}. Please try again.`);
                this.start();
            } else {
                console.log(`Your move: ${userMove}`);
                console.log(`Computer's move: ${computerMove}`);
                const result = this.winner.determineWinner(userMove, computerMove);
                if (result === "draw") {
                    console.log("It's a draw!");
                } else if (result === "user") {
                    console.log("You win!");
                } else {
                    console.log("You lose!");
                }
                console.log(`HMAC key: tbd`);
                rl.close();
            }
        }
      });
    }
  }
  
  class Winner {
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
    static generateSecureKey() {
        return crypto.randomBytes(32).toString('hex');
    }

    static generateHmac(key, data) {
        const hmac = crypto.createHmac('sha3-256', key);
        hmac.update(data);
        return hmac.digest('hex');
    }
}

const moves = process.argv.slice(2);    
const game = new Game(moves);
