import React,{Component} from 'react';
import './App.css';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import Particles from 'react-particles-js';  


const particlesOptions = {
  particles: {
      number:{
          value:100,
          density:{
            enable:true,
            value_area:800
          }
        },
       size: {
           value:3
         },
       opacity:{
           value:0.5
       } 
      } 
    };

    const app = new Clarifai.App({
      apiKey: 'b26d8860420b41fc8b6d5a20fe230d40'
     });
  


class App extends Component {

  constructor(){
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box: {}
    }
  }

  calculateFaceLocation = (data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    console.log(clarifaiFace);
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    console.log(typeof width);
    const height = Number(image.height);
    return {
      leftCol:clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    } 
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box:box});
  }




  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl:this.state.input});

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(response=>{
      console.log('heh');
     this.displayFaceBox(this.calculateFaceLocation(response));
    }).catch((e) => e.printStackTrace());
  };

    render(){
  return (
    <div className="App">
         <Particles className="particles" params={particlesOptions} />
        <Navigation />
        <Logo/>
        <Rank />
        <ImageLinkForm  onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        </div>
  );
}
}
export default App;
