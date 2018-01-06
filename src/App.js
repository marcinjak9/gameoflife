import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h1 className="App-title">Welcome to React</h1>
//         </header>
//         <p className="App-intro">
//           To get started, edit <code>src/App.js</code> and save to reload.
//         </p>
//       </div>
//     );
//   }
// }

// export default App;

let board = [];
const height= 40;
const width = 40;
const cellSchema = {
  value: 0,
  score: 0
}


export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      board: board,
      playing: false,
      now: 0,
      generation: 0
    }
  }

  componentDidMount = () => {
    this.createBoard(true)
  }
  
  
  resetBoard = () => {
    this.createBoard(true)
  }  

  createBoard = (randomize) => {
    let board = []
    for(let i = 0; i < height; i++){
      board.push([]);
      for(let j = 0; j < width; j++){
        let val = 0;
        if (randomize){
          val = Math.floor(Math.random() * 2 );
        }
        
        board[i].push({
        value: val ,
        score: 0
      })  
      }
    }
    this.setState({ board })
  }
  
  handleActive = (rowI, cellI) => {
    let actualBoard = this.state.board;
    if (actualBoard[rowI][cellI].value == 0) {
      actualBoard[rowI][cellI].value = 1
    } else if (actualBoard[rowI][cellI].value == 1) {
      actualBoard[rowI][cellI].value = 0
    }
    this.setState({board: actualBoard})
  }
  
  firstRule = (rowI, cellI) => {
    
  }
  
  getScore = (rowI,cellI) => {
    let score = 0;
    let actualBoard = this.state.board
    for (let i = -1; i <= 1; i++){
      for (let j = -1; j <= 1; j++){
        if (i !== 0 || j != 0){
          if (rowI + i >= 0 && cellI + j >= 0 && rowI + i < width-1 && cellI < height - 1){
            let value = actualBoard[rowI + i][cellI + j].value
            if (value === undefined){
              value = 0;
            }
            score = score + value
          }
        }
      }
    }
    return score
  }
  
  executeLives = (rowI, cellI) => {
    let actualBoard = this.state.board;
    let actualScore;
    const score = this.getScore(rowI, cellI)
    if (score < 2){
      actualBoard[rowI][cellI].value = 0;
    }
    if (score > 3){
      actualBoard[rowI][cellI].value = 0;
    }
    if (score === 3){
      actualBoard[rowI][cellI].value = 1;
    }
    
    return score;
    // actualBoard[rowI][cellI].score = score;
    // this.setState({ board: actualBoard })
    // console.log(actualBoard)
  }
  
  doingGame = () => {
    let actualBoard = this.state.board
    this.state.board.map((row, rowI) => {
      row.map((cell, cellI) => {
        actualBoard[rowI][cellI].score = this.executeLives(rowI, cellI)
      })
    })
    if (this.state.playing){
      this.setState({ board: actualBoard, generation: this.state.generation + 1 })
      window.requestAnimationFrame(this.doingGame);
    }
    
  }
  
  startGame = () => {
    this.setState({ playing: true, now: new Date().getTime() })
    window.requestAnimationFrame(this.doingGame);
  }

  stopGame = () => {
    window.cancelAnimationFrame(this.doingGame);
    this.setState({ playing: false, generation: 0 })
    this.createBoard(true);
  }

  clear = () => {
    this.stopGame();
    this.createBoard(false)
  }
  
  render(){
    const width = this.state.board.length * 10
    return (
      <div className="container">
        <div className="controls">
          <button className="start" onClick={this.startGame}>start</button>
          <button onClick={this.stopGame}>stop</button>
          <button onClick={this.clear}>Clear</button>
          <p>{this.state.generation}</p>
        </div>
        
        <div style={{ backgroundColor: "#111", width: `${width}px`, height: `${width}px`, lineHeight: 0, margin: "0 auto"}} >
          {this.state.board.map((row, j) =>{ 
            return row.map((cell, i) => 
                           <Cell 
                             key={i}
                             onClick={() => this.handleActive(j, i)}
                             active={cell.value}
                             score={cell.score}
                             />)
                           })}
        </div>
 
      </div>
    )
  }
}

const Cell = (props) => {

  return (
    <div 
      onClick={props.onClick} 
      style={{ height: "10px", width: "10px", backgroundColor: props.active === 1 ? "#BDEDE0" : "#000", display: "inline-block", margin: 0, padding: 0, lineHeight: 0}} 
      ></div>
  )  
}