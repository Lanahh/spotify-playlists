import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

let fakeServerData = {
  user: {
    name: "Steve",
    playlists: [
      {
        name: "Love songs",
        songs: [
          { name: "Beat it", duration: 1234 },
          { name: "I like you", duration: 1234 }
        ]
      },
      {
        name: "Hit songs",
        songs: [
          { name: "Last Christmas", duration: 1234 },
          { name: "All I Want For Christmas Is You", duration: 1234 }
        ]
      },
      {
        name: "Top songs",
        songs: [
          { name: "Last Christmas", duration: 1234 },
          { name: "All I Want For Christmas Is You", duration: 1234 }
        ]
      },
      {
        name: "Hit songs",
        songs: [
          { name: "Last Christmas", duration: 1234 },
          { name: "All I Want For Christmas Is You", duration: 1234 }
        ]
      },
      {
        name: "Seasons songs",
        songs: [
          { name: "Fall", duration: 2000 },
          { name: "Summer", duration: 1000 }
        ]
      }
    ]
  }
}
class PlaylistsCounter extends Component {
  render() {
    return (
      <div style={{ width: '40%', display: 'inline-block' }}>
        <h2 >{this.props.playlists && this.props.playlists.length} Playlists</h2>
      </div>
    )
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce(
      (songs,eachPlaylist)=> {
      return songs.concat(eachPlaylist.songs)
    }, [])
    let totalDuration = allSongs.reduce((sum, eachSong)=>{
      return sum +eachSong.duration
    }, 0)
    return (
      <div style={{ width: '40%', display: 'inline-block' }}>
        <h2>{Math.round(totalDuration/60)}mins</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={{'clear':'both'}}>
        <img />
        <input type="text" onKeyUp={event => 
          this.props.onTextChange(event.target.value)}/>
        <hr></hr>
      </div>
    )
  }
}

class Playlist extends Component {
  render() { 
    let playlist = this.props.playlist
    return (
      <div style={{ 'width': "50%", 'display': "inline-block"}}>  
        <img />
        <h3 style={{'font-size':'25px'}}>{this.props.playlist.name}</h3>
        <ul >
            {playlist.songs.map(song =>  
              <li>{song.name}</li>
              )}
        </ul> 
      </div>
      );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = { serverData: {} }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({serverData: fakeServerData}) 
      }, 1000); 
    setTimeout(()=>{
      this.setState({filterString:''})
    },2000);
  }
  render() {
    let playlistToRender = this.state.serverData.user ? this.state.serverData.user.playlists
    .filter(playlist =>
      playlist.name.includes(
        this.state.filterString)
  ) : []

    return (
      <div className="App">
        {this.state.serverData.user ?
          <div>
            <h1 className="App-header">
              {this.state.serverData.user.name}'s Favorite Playlists
            </h1>
          <div  style={{'margin-left': '10%'}}>
            <PlaylistsCounter playlists={this.state.serverData.user.playlists} />
            <HoursCounter  playlists={this.state.serverData.user.playlists} />
            <Filter onTextChange={text => {
              this.setState({filterString: text})
            }}/>
          {playlistToRender.map(playlist => 
            <Playlist playlist={playlist} />
          )}
          </div>  
          </div> : <h1 className="App-header">Loading...</h1>
        }
      </div>
    );
  }
}

export default App;
