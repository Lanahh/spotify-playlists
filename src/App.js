import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';

// eslint-disable-next-line 
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
        <h2 >{this.props.playlists.length} Playlists</h2>
      </div>
    )
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce(
      (songs, eachPlaylist) => {
        return songs.concat(eachPlaylist.songs)
      }, [])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return (
      <div style={{ width: '40%', display: 'inline-block' }}>
        <h2>{Math.round(totalDuration / 60)}mins</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={{ 'clear': 'both' }}>
        <input type="text" onKeyUp={event =>
          this.props.onTextChange(event.target.value)} />
        <hr></hr>
      </div>
    )
  }
}

class Playlist extends Component {
  render() {
    let playlist = this.props.playlist
    return (
      <div style={{ display: 'inline-block', width: "25%" }}>
        <img alt="" src={playlist.imageUrl} style={{ width: '60px' }} />
        <h3>{playlist.name}</h3>
        <ul>
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
    this.state = {
      serverData: {},
      filterString: ''
    }
  }
  componentDidMount() {
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token;
    if (!accessToken)
      return;
    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
      .then(data => this.setState({
        user: {
          name: data.display_name
        }
      }))

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then(response => response.json())
      .then(data => this.setState({
        playlists: data.items.map(item => {
          console.log(data.items)
          return {
            name: item.name,
            imageUrl: item.images[0].url,
            songs: []
          }
        })
      }))

  }
  render() {
    let playlistToRender =
      this.state.user &&
        this.state.playlists
        ? this.state.playlists.filter(playlist =>
          playlist.name.includes(
            this.state.filterString))
        : [] 
    return (
      <div className="App">
        {this.state.user ?
          <div>
            <h1 className="App-header">
              {this.state.user.name}'s Favorite Playlists
            </h1>
            <div style={{ 'margin-left': '10%' }}>
              <PlaylistsCounter playlists={playlistToRender} />
              <HoursCounter playlists={playlistToRender} />
              <Filter onTextChange={text => {
                this.setState({ filterString: text })
              }} />
              {playlistToRender.map(playlist =>
                <Playlist playlist={playlist} />
              )}

            </div>
          </div> : <button onClick={() => {
            window.location = window.location
            .href.includes('localhost')
              ? 'http://localhost:8888/login'
              : 'https://oauth-spotify-template.herokuapp.com/login'
          }
          }
            style={{ padding: '20px', 'fontSize': '50px', 'margin': '50px 30% 0 30%' }}>Sign in with Spotify</button>
        }

      </div>
    );
  }
}

export default App;
