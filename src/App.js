import React, { Component } from 'react';
import './App.css';
import queryString from 'query-string';

// eslint-disable-next-line 
// let fakeServerData = {
//   user: {
//     name: "Steve",
//     playlists: [
//       {
//         name: "Love songs",
//         songs: [
//           { name: "Beat it", duration: 1234 },
//           { name: "I like you", duration: 1234 }
//         ]
//       },
//       {
//         name: "Hit songs",
//         songs: [
//           { name: "Last Christmas", duration: 1234 },
//           { name: "All I Want For Christmas Is You", duration: 1234 }
//         ]
//       },
//       {
//         name: "Top songs",
//         songs: [
//           { name: "Last Christmas", duration: 1234 },
//           { name: "All I Want For Christmas Is You", duration: 1234 }
//         ]
//       },
//       {
//         name: "Hit songs",
//         songs: [
//           { name: "Last Christmas", duration: 1234 },
//           { name: "All I Want For Christmas Is You", duration: 1234 }
//         ]
//       },
//       {
//         name: "Seasons songs",
//         songs: [
//           { name: "Fall", duration: 2000 },
//           { name: "Summer", duration: 1000 }
//         ]
//       }
//     ]
//   }
// }
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
      <div style={{ width: '50%' ,display: 'inline-block'}}>
        <span style={{margin:"30px"}}> 
          <h3>{playlist.name}</h3>          
          <img alt="" src={playlist.imageUrl} style={{ width: '60px' }} />
          <ul style={{padding:"30px"}}>
            {playlist.songs.map(song =>
              <li>{song.name}</li>
            )}
          </ul>
        </span>
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
      .then(playlistData => {
        let playlists = playlistData.items
        let trackDataPromises = playlists.map(playlist => {
          let responsePromise = fetch(playlist.tracks.href, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
          })
          let trackDataPromise = responsePromise
            .then(response => response.json())
          return trackDataPromise
        })
        let allTracksDataPromises = Promise.all(trackDataPromises)
        let playlistsPromise = allTracksDataPromises.then(trackDatas => {
          trackDatas.forEach((trackData, i) => {
            playlists[i].trackDatas = trackData.items
              .map(item => item.track)
              .map(trackData => ({
                name: trackData.name,
                duration: trackData.duration_ms / 1000
              }))
          })
          return playlists
        })
        return playlistsPromise
      })
      .then(playlists => this.setState({
        playlists: playlists.map(item => {
          return {
            name: item.name,
            imageUrl: item.images[0].url,
            songs: item.trackDatas.slice(0, 3)
          }
        })
      }))

  }
  render() {
    let playlistToRender =
      this.state.user &&
        this.state.playlists
        ? this.state.playlists.filter(playlist =>{
          let matchesPlaylist = playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase()) 
          let matchesSong = playlist.songs.find(song => song.name.toLowerCase()
            .includes(this.state.filterString.toLowerCase()))
          return matchesPlaylist || matchesSong
        }) : []
    return (
      <div className="App">
        {this.state.user ?
          <div>
            <h1 className="App-header">
              {this.state.user.name}'s Favorite Playlists
            </h1>
            <div style={{ 'marginLeft': '10%' }}>
              <PlaylistsCounter playlists={playlistToRender} />
              <HoursCounter playlists={playlistToRender} />
              <Filter onTextChange={text => {
                this.setState({ filterString: text })
              }} />
              {playlistToRender.map(item =>
                <Playlist playlist={item} />
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
