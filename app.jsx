
var PLAYERS = [
  {
    name: "Jim",
    score: 45,
    key: 1,
  },
  {
    name: "Chris",
    score: 21,
    key: 2,
  },
  {
    name: "Jim",
    score: 33,
    key: 3,
  },
]
let nextKey = 4;

var Stopwatch = React.createClass({

  getInitialState: function(){
    return {
      running: false,
      elapsedTime: 0,
      previousTime: 0

    }
  },
  componentDidMount: function(){
    // from demo, not necessary
    // var now =  Date.now();
    // this.setState({previousTime: now});
    // this.interval = setInterval(this.tick,  100);
  },
  componentWillUnmount: function(){
    clearInterval(this.interval);
  },
  tick: function(){
    var now = Date.now();
    var diff = now - this.state.previousTime;
    var newElapsed = this.state.elapsedTime + diff;
    this.setState({
      elapsedTime: this.state.elapsedTime + diff,
      previousTime: now
    });
  },
  onStart : function(){
    this.setState({
      running: true,
      previousTime: Date.now()
    });
    this.interval = setInterval(this.tick,  100);
  },
  onStop : function(){
    clearInterval(this.interval);
    this.setState({running: false });
  },
  onReset : function(){
    this.onStop();
    this.setState({
      elapsedTime: 0
    })
  },
  render: function(){
    var formattedTime = Math.floor(this.state.elapsedTime/1000);
    // var startStop = this.state.running ? <button>Stop</button>: <button>Start</button>;
    return(
      <div className="stopWatch">
        <h2>StopWatch</h2>
        <div className="stopwatch-time">{formattedTime}</div>
        {this.state.running ?
        <button onClick={this.onStop}>Stop</button>
        :
        <button onClick={this.onStart}>Start</button>}
        <button onClick={this.onReset}>Reset</button>
      </div>

    )
  }
})

var AddPlayerForm = React.createClass({
  propTypes: {
    onAdd: React.PropTypes.func.isRequired,
  },
  onSubmit: function(e){
    e.preventDefault();
    this.props.onAdd(this.state.name);
    this.setState({name: ''});
  },
  getInitialState:function(){
    return {
      name: "",
    }
  },
  onNameChange: function(e){
    console.log(e.target.value);
    this.setState({name: e.target.value});
  },

  render: function(){
    return (
      <div className="add-player-form">
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.name} onChange={this.onNameChange}></input>
          <input type="submit" value="Add Player"></input>
        </form>
      </div>
    );
  }
});

function Stats(props){
  var totalPlayers = props.players.length;
  var totalPoints = props.players.reduce((total, player) =>{
     return total + player.score }
  , 0)
  return(
    <table>
      <tbody>
        <tr>
          <td>Players</td>
          <td>{totalPlayers}</td>
        </tr>
        <tr>
          <td>Total Points</td>
          <td>{totalPoints}</td>
        </tr>
      </tbody>
    </table>
  );
}

Stats.propTypes = {
  players: React.PropTypes.array.isRequired,
}

function Header(props){
    return (
    <div className="header">
      <Stats players={props.players}/>
      <h1>{props.title}</h1>
      <Stopwatch/>
    </div>
  );
}
Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  players: React.PropTypes.array.isRequired,

}



function Counter(props){
  return (
    <div className="counter">
      <button className="counter-action decrement" onClick={function(){  props.onChange(-1)}}  > - </button>
      <div className="counter-score">{props.score}</div>
      <button className="counter-action increment" onClick={function(){ props.onChange(1)}}> + </button>
  </div>
  );
}
Counter.propTypes = {
  score: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
}


function Player(props){
  return(
    <div className="player">

      <div className="player-name">
        <a className="remove-player" onClick={props.onRemove}>❌</a>
          {props.name}
      </div>
      <div className="player-score">
        <Counter score={props.score} onChange={props.onScoreChange}/>
      </div>
  </div>
  );
}

Player.propTypes = {
  name: React.PropTypes.string.isRequired,
  score: React.PropTypes.number.isRequired,
  onScoreChange: React.PropTypes.func.isRequired,
  onRemove: React.PropTypes.func.isRequired,
}



var Application = React.createClass({
  propTypes : function() {
    return{
      title: React.PropTypes.string,
      initialPlayers: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        score: React.PropTypes.number.isRequired,
        key: React.PropTypes.number.isRequired,
      })).isRequired,
    }
  },
  getDefaultProps: function(){
    return {
      title: "Scoreboard",
    }
  },
  getInitialState: function(){
    return {
      players: this.props.initialPlayers,
    };
  },
  onScoreChange: function(index, delta){
    this.state.players[index].score += delta;
    this.setState(this.state);
  },
  onPlayerAdd: function(name){
    this.state.players.push({
      name,
      score: 0,
      key: nextKey
    });

    nextKey++;
    this.setState(this.state);

  },
  onRemovePlayer: function(index){
    this.state.players.splice(index, 1);
    this.setState(this.state);
    console.log(index);
  },
  render: function(){
    return (
      <div className="scoreboard">
        <Header title = {this.props.title} players={this.state.players}/>
          <div className="players">
            {this.state.players.map(function(player, index){
              return(

                <Player
                onScoreChange={function(delta){this.onScoreChange(index, delta)}.bind(this)
                }
                onRemove={function(){this.onRemovePlayer(index)}.bind(this)}
                name={player.name}
                score={player.score}
                key={player.key}
                ></Player>
                );
            }.bind(this))}
          </div>
          <AddPlayerForm onAdd={this.onPlayerAdd}/>
      </div>
    );
  },
})



ReactDOM.render(<Application initialPlayers={PLAYERS}/>, document.getElementById('container'));
