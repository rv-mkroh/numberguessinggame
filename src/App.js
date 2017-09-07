import React, { Component } from 'react';
import ordinal from 'ordinal-numbers'
import './index.css';

const initState = {
  game: {
    inProgress: false,
    range: {
      standard: 10,
      expert: 100
    },
    highScore: {
      standard: 100,
      expert: 1000
    },
    gamesPlayed: 0,
    currentGame: {
      currentLevel: 'standard',
      targetNumber: 0,
      guesses: 0,
      currentGuess: '',
      currentMessage: '',
      offerPlayAgain: false
    }
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = initState;
    this.handleNewNumber = this.handleNewNumber.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleNewNumber(num) {
    const random = Math.floor(Math.random() * (num + 1));
    let game = Object.assign({}, this.state.game);
    game.currentGame.currentLevel = num === 10 ? 'standard' : 'expert';
    game.currentGame.targetNumber = random;
    game.gamesPlayed++;
    game.currentGame.guesses = 0;
    game.inProgress = true;
    this.setState({
      game: game
    });
  }

  handleReset(){
    let game = Object.assign({}, this.state.game);
    game.inProgress = false;
    game.currentGame.guesses = 0;
    game.currentGame.currentGuess = '';
    game.currentGame.currentMessage = '';
    game.currentGame.offerPlayAgain = false;
    this.setState({
      game
    });
  }

  handleChange(event) {
    const text = event.target.value;
    let game = Object.assign({}, this.state.game);
    game.currentGame.currentGuess = text;
    this.setState({
      game: game
    });
  }

  handleGuess() {
    // increase # of guesses
    let game = Object.assign({}, this.state.game);
    game.currentGame.guesses++;

    let message;
    const thisGuess = parseInt(this.state.game.currentGame.currentGuess, 10);
    const target = this.state.game.currentGame.targetNumber;
    if(thisGuess === target) {
      game.currentGame.offerPlayAgain = true;
      if(this.state.game.currentGame.guesses < this.state.game.highScore[this.state.game.currentGame.currentLevel]) {
        message = `New Record Score! You won in ${this.state.game.currentGame.guesses}`;
        game.highScore["standard"] = this.state.game.currentGame.guesses;
      } else {
        message = `You won in ${this.state.game.currentGame.guesses}`;
      }

    } else if (thisGuess > target) {
      message = `Your guess was too high`;
    } else {
      message = `Your guess was too low`;
    }
    game.currentGame.currentMessage=message;
    game.currentGame.currentGuess='';

    this.setState({
      game: game
    });

  }

  render() {
    return (
      <div id="container">
      { !this.state.game.inProgress ? (
        <section id="gamestart">
          <h1>Start Game</h1>
          <div><button onClick={()=>{ this.handleNewNumber(this.state.game.range.standard); }}>Standard</button> <button onClick={()=>{ this.handleNewNumber(this.state.game.range.expert); }}>Expert</button></div>
        </section>
        ) : (
        <section id="inprogress">
          <h1>Game On!</h1>
          { this.state.game.gamesPlayed > 1 ? (
            <p>This is your {ordinal(this.state.game.gamesPlayed)} game and your best score so far is {this.state.game.highScore[this.state.game.currentGame.currentLevel]} tries at the {this.state.game.currentGame.currentLevel} level.</p>

            ) : (
            <p>This is your {ordinal(this.state.game.gamesPlayed)} game. Good luck!</p>
          )}
          <div>
            <label htmlFor="guess">Guess a number: <input type="text" id="guess" onChange={this.handleChange} value={this.state.game.currentGame.currentGuess} /></label>
            <button onClick={this.handleGuess}>Submit</button>
          </div>
          <p id="message">{this.state.game.currentGame.currentMessage}</p>
          { this.state.game.currentGame.offerPlayAgain ? (
            <button id="playagain" onClick={this.handleReset}>Play Again</button>
          ) : (
            <div>
              <h2 id="guesses"># of guesses: {this.state.game.currentGame.guesses}</h2>
              <button id="reset" onClick={this.handleReset}>I quit. Reset!</button>
            </div>
          )}
        </section>
        )}
      </div>
    );
  }
}

export default App;
