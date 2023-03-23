const { AsciiTable3 } = require('ascii-table3');

class TableGenerator {
    constructor(moves, winnerSelector) {
        this.moves = moves;
        this.winnerSelector = winnerSelector;
        this.table = new AsciiTable3('Moves and Results');
        this.table.setHeading('', ...moves);
        this.fillTable();
    }
     
    fillTable() {
        const tableData = this.moves.map((move1) => {
            const row = [move1];
            return this.moves.reduce((acc, move2) => {
                if (move1 === move2) {
                    acc.push('-');
                } else {
                    const result = this.winnerSelector.determineWinner(move1, move2);
                    acc.push(result === 'user' ? 'win' : 'lose');
                }
                return acc;
            }, row);
        });
        this.table.addRowMatrix(tableData);
    }
  
    printTable() {
        console.log(this.table.toString());
    }
  }
  
  module.exports = TableGenerator;
