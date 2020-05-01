import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Box extends React.Component {
  // changes border-color and chooses this box to select an album for
  selectBox = () => {
    this.props.selectBox(this.props.boxPosition)
  }

  render() {
    return (
      <div className="head-album-container" key={this.props.boxYear}>
        <h3>{this.props.boxYear}</h3>
        <div className={this.props.boxClass} onClick={this.selectBox}>
          <img className="box-img" src={this.props.img} alt=""/>
        </div>
      </div>
    )
  }
}

class Grid extends React.Component {
	render() {
    // for each year, create a card that has the name of year as a header and a box for the album
    let years = this.props.albumFull;
    let yearsArr = [];
    let boxYear = 2011;
    let boxClass = '';

    years.forEach(year => {
      let img = '';
      if (year === true) { // selected
        boxClass = 'box on';
      } else if (year === false) { // not selected
        boxClass = 'box off';
      } else { // not selected, but has an album
        boxClass = 'box off'
        img = year;
      }
      yearsArr.push(
        <Box
          boxClass={boxClass}    // box is either on or off (album chosen or not)
          boxYear={boxYear}        // key represents the year
          key={boxYear}
          img={img}
          boxPosition={boxYear - 2011}
          selectBox={this.props.selectBox}
        />
      );
      boxYear++;
    });

		return (
			<div className="grid">
				{yearsArr}
			</div>
		);
	}
}

// Album List Element
class Album extends React.Component {
  selectAlbum = () => {
    this.props.selectAlbum(this.props.albumPosition);
  }

  render() {
    return (
      <div>
        <li key={this.props.album.url} className="album-container" onClick={this.selectAlbum}>
          <div className="album">
            <img src={this.props.album.image[1]['#text']} alt="album cover"/>
            <div className="text">
              <p>{this.props.album.name}</p>
              <p>{this.props.album.artist}</p>
            </div>
          </div>
        </li>
      </div>
    )
  }
}

// List of 8 albums elements
class List extends React.Component {
  render() {
    let albumPosition = 0;
    let albumList = [];
    let albums = this.props.albums;

    albums.forEach(album => {
      albumList.push (
        <Album 
          selectAlbum={this.props.selectAlbum}
          albumPosition={albumPosition}
          key={albumPosition}
          album={album}
        />
      )
      albumPosition++;
    });

    return (
      <ul className="the-list">
        {albumList}
      </ul>
    )
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      albumFull: [true, false, false, false, false, false, false, false, false, false], // 10 empty album placeholders
      search: '',
      albums: [],
    }
  }

  // Allow user to select year to update
  selectBox = (position) => {
    let albumCopy = this.state.albumFull;
    if (albumCopy[position] === true) { // unselect the current selection
      albumCopy[position] = false;
    } else if (albumCopy.indexOf(true) !== -1) { // another box is already selected
      albumCopy[albumCopy.indexOf(true)] = false; // unselect it
      albumCopy[position] = !albumCopy[position];
    } else {
      albumCopy[position] = !albumCopy[position]; // no box is selected yet
    }
    this.setState({
      albumFull: albumCopy
    })
  }

  // Allow user to select preferred album, and place it into position
  selectAlbum = (position) => {
    let albumCopy = this.state.albumFull;
    albumCopy[albumCopy.indexOf(true)] = this.state.albums[position].image[2]['#text'] // replace the "true" with the album cover
    this.setState({
      albums: [],
      albumFull: albumCopy,
    })
  }

  // Return albums from LastFM API
  getAlbums = async (e) => {
    e.preventDefault();
    if (this.state.search !== '' & this.state.albumFull.includes(true)) { // only search if input is ready and album selected
      const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=album.search&album=${this.state.search}&limit=20&api_key=e30ac2cef97e4cb6a6434a55d8932c4a&format=json`);
      const data = await response.json();
      this.setState({
        albums: data.results.albummatches.album
      })
    } else { // if input empty, get rid of album list
      this.setState({
        albums: [],
      })
    }
  }

  updateSearch = e => {
    this.setState({
      search: e.target.value
    });
  }

  render() {
    let albums = this.state.albums;
    return (
      <div className="main">
        <h1>10 Years of Music</h1>
        <p>Your favorite albums of the last decade!</p>
        <form onSubmit={this.getAlbums} className="search-form">
          <input className="search-bar" type="text" placeholder="Search for Album..." value={this.search} onChange={this.updateSearch} />
          <button className="search-button" type="submit">Search</button>
        </form>
        {/* If albums are being fetched, show them to user */}
        {albums.length > 0 && 
        <List 
          albums={albums}
          selectAlbum={this.selectAlbum}
        />
        }
        <Grid 
          albumFull={this.state.albumFull}
          selectBox={this.selectBox}
          albums={this.albums}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);