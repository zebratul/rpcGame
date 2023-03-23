const crypto = require('crypto');
const readline = require('readline');
const WinnerSelector = require('./utils/winnerselector');
const CryptoUtils = require('./utils/cryptoutils');
const TableGenerator = require('./utils/tablegenerator');

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
        if (this.moves.length % 2 === 0 || this.moves.length < 3 || new Set(this.moves).size !== this.moves.length ) {
            console.log(errMessage);
            this.rl.close();
            return;
        }
        const hmac = this.cryptoUtils.generateHmac(this.key, this.computerMove);
        console.log(`HMAC: ${hmac}\nAvailable moves:`);
        this.moves.forEach((element, index) => console.log(`${index+1} - ${element}`));
        console.log('0 - exit\n? - help');
        this.readUserInput();
    }
  
    readUserInput() {
        this.rl.question(`Enter your move: `, (answer) => {
            if (answer === "0") {
            console.log("Exiting the game...\n");
            this.rl.close();
            } else if (answer == "?") {
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
            console.log(`\nYour move: ${userMove}\nComputer move: ${this.computerMove}`);
            const result = this.winner.determineWinner(userMove, this.computerMove);
            if (result === "draw") {
            console.log("It's a draw!");
            } else if (result === "user") {
            console.log("You win!");
            } else {
            console.log("You lose!");
            }
            console.log(`HMAC key: ${this.key}\n`);
            this.restartGame();
        }
    }

    restartGame() {
        this.rl.question(`Do you wish to try again? [Y] / [N] `, (answer) => {
            if (answer == "y") {
                this.computerMove = this.moves[crypto.randomInt(this.moves.length)];
                this.key = this.cryptoUtils.generateSecureKey();
                this.start();
            } else {
                this.rl.close();
            }
        });
    }

  }

  const errMessage = 'Error: please provide an odd number of non-repeating moves (minimum 3).\nExample usage: node index.js rock paper scissors';
  const moves = process.argv.slice(2); 
  process.argv[2] !== undefined ? new Game(moves) : console.log(errMessage);