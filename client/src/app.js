import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Dogs from './components/dogs.js';
import style from 'styled-components'

const StyledDiv = style.div`
  width: 100%
  margin: auto;
  box-sizing: border-box;
  height: 400px;
  color: #6504b5;
  text-align: center;
`;

const StyledBreedName = style.div`
  position: relative;
  box-sizing: border-box;
  top: -2055px;
  left: 10px;
  width: 700px;
  padding: 0 15px;
  height: 35px;
  color: #4d4751;
  font-size: 30px;
  text-align: left;
  background-color: #fff;
`;

const StyledBreedImg = style.div`
  position: relative;
  box-sizing: border-box;
  top: -1970px;
  left: 12px;
  height: 0;
  width:0;
  padding: 0 15px;
  color: #4d4751;
  font-size: 30px;
  text-align: left;
  background-color: #fff;
`;

var url = window.location.hostname === 'localhost' ? 'http://localhost' : 'http://ec2-54-90-115-26.compute-1.amazonaws.com';

console.log('url', url);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      breedId: 1,
      breed: "A Dog Breed",
      dogs: [],
      location: {
        on: false,
        latitude: 40.930,
        longitude: -74.041
      },
      display: {
        width: 0,
        height: 0
      },
      breedImg: 'https://sagittarius-pups.s3-us-west-1.amazonaws.com/pups-small/aaron-bookout-3NJ_LjXXqsM-unsplash.jpg'
    }

    this.coordinates = this.coordinates.bind(this);
    this.windowDimensions = this.windowDimensions.bind(this);
  }

  windowDimensions() {
    this.setState({
      display: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
  }

  dogFinder() {
    axios.get(url + ':3003/getAllMatchingBreed', {
      params: {
        key: this.state.breedId
      }
    })
    .then((res) => {
      this.setState({
        dogs: res.data
      })
    })
    .catch((err) => {
      if (err) { throw err; }
    })
  }

  breedImgFinder() {
    var imgUrl = window.location.hostname === 'localhost' ? 'http://localhost' : 'http://ec2-54-185-0-112.us-west-2.compute.amazonaws.com';

    axios.get(imgUrl + ':3001/url/' + this.state.breedId)
      .then((data) => {
        this.setState({
         breedImg: data.data.url
      })
    })
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.coordinates, this.locationError);
    } else {
      console.log("Geolocation is not supported by this browser.")
    }
  }

  locationError(err) {
    if (err.PERMISSION_DENIED) {
      console.log("User denied location request.");
    } else if (err.POSITION_UNAVAILABLE) {
      console.log("Location unavailable.");
    } else if (err.TIMEOUT) {
      console.log("Location request timed out.");
    } else if (err.UNKNOWN_ERROR) {
      console.log("Location request resulted in an unknown error.");
    } else {
      console.log('Error: ', err);
    }
  }

  coordinates(position) {
    this.setState({
      location: {
        on: true,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    
    })
  }

  getBreedName(breedId) {
    let queryString = `?id=${breedId}`;
    axios.get(url + `:3002/api/oneBreed/${queryString}`)
    .then((res) => {
      console.log('res:', res)
      this.setState({
        breed: res.data.about.breedName
      })
    })
    .catch((err) => {
      if (err) { 
        this.setState({
          breed: "Bernese Mountain Dog"
        })
      }
    })
  }

  componentDidMount() {
    window.addEventListener("resize", this.windowDimensions);
    var breedId = Number.parseFloat(window.location.pathname.replace(/^\/+|\/+$/g, ''));
    if (Number.isNaN(breedId)) {
      breedId = 1;
    }
    this.setState({
      breedId: breedId 
    }, () => {
      console.log(this.state, ' the state')
      this.dogFinder();
      this.breedImgFinder()
      this.getLocation();
      this.getBreedName(this.state.breedId); //this will eventually be the id in the URL
    })
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.windowDimensions);
  }

  render() {
    return (
      <div>
      <StyledBreedName>
          <div className="breedName">
            {this.state.breed}
          </div>  
      </StyledBreedName>
      <StyledBreedImg>
          <div className="breedImgDiv">
            <img src={this.state.breedImg} className="breedImg" width='285px' height='190px'></img>
          </div>  
      </StyledBreedImg>
      <StyledDiv>
        <div>
          <h1>{this.state.breed}s Availabile Nearby</h1>
          <Dogs dogs={this.state.dogs} breedId={this.state.breedId} breed={this.state.breed} location={this.state.location} display={this.state.display}/>
        </div>
      </StyledDiv>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('availability'));