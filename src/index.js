import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// API_KEY = e30ac2cef97e4cb6a6434a55d8932c4a

// Allow user to select album
// Update box with that album

// DO THESE FIRST VVVV
// Completely rework the grid to display the 10 years and boxes appropriately
// Make album placeholders inline pairs of two 

class Box extends React.Component {
  // changes border-color to blue and chooses this box to select an album for
  selectBox = () => {
    console.log('you clicked me');
    this.props.selectBox(this.props.key)
  }

  render() {
    return (
      <div className="head-album-container">
        <h3>{this.props.boxKey}</h3>
        <div className={this.props.boxClass} onClick={this.selectBox}/>
      </div>
    )
  }
}

class Grid extends React.Component {
	render() {
    // for each year, create a card that has the name of year as a header and a box for the album
    let years = this.props.albumFull;
    let yearsArr = [];
    let boxClass = '';
    let boxKey = 2011;

    years.forEach(year => {
      if (year) {
        boxClass = 'box on';
      } else {
        boxClass = 'box off';
      }

      yearsArr.push(
        <Box
          boxClass={boxClass}    // box is either on or off (album chosen or not)
          boxKey={boxKey}        // key represents the year
          selectBox={this.props.selectBox}
        />
      );
      boxKey++;
    });

		return (
			<div className="grid">
				{yearsArr}
			</div>
		);
	}
}

// Currently List receives 6 albums and displays buttons.
// Make each button show the album cover, name, and author.
// User chooses one, and this information is inputted into a specific box
const List = (props) => {
  return (
    <div className="the-list">
      <ul className="album-list">
        {props.albums.map(album => (
          <li key={album.url} className="album-container">
            <div className="album">
              <img src={album.image[1]['#text']} alt="album cover" className="img"/>
              <p>{album.name}<br/>{album.artist}</p>
            </div>
          </li>
        ))}      
      </ul>
    </div>
  )
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      albumFull: [false, false, false, false, false, false, false, false, false, false], // 10 empty album placeholders
      search: '',
      albums: [],
    }
    this.updateSearch = this.updateSearch.bind(this);
  }

  // getAlbums returns 8 albums from Spotify API
  getAlbums = async (e) => {
    e.preventDefault();
    if (this.state.search !== '') { // only search if input is ready
      const response = await fetch(`http://ws.audioscrobbler.com/2.0/?method=album.search&album=${this.state.search}&limit=8&api_key=e30ac2cef97e4cb6a6434a55d8932c4a&format=json`);
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

  // updateSearch function (display 5 albums that resemble user search)
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
        <p>"you are what you listen to"</p>
        <form onSubmit={this.getAlbums} className="search-form">
          <input className="search-bar" type="text" placeholder="Search for Album..." value={this.search} onChange={this.updateSearch} />
          <button className="search-button" type="submit">Search</button>
        </form>
        {/* If albums are being fetched, show them to user */}
        {albums.length > 0 && 
        <List 
          albums={albums}
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