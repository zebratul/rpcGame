class WinnerSelector {
    constructor(moves) {
        this.moves = moves;
    }

    determineWinner(userMove, computerMove) {
        const winningMoves = this.determineWinMoves(userMove);
        
        if (userMove === computerMove) {
            return "draw";
        } else if (winningMoves.includes(computerMove)) {
            return "computer";
        } else {
            return "user";
        }
    }

    determineWinMoves (userMove) {
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
        
        return winningMoves;
    }
}

module.exports = WinnerSelector;
