import React,{Component} from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import SignIn from './components/signIn/SignIn';
import Register from './components/register/Register';
import Particles from 'react-particles-js';  

// BACKGROUIND ANIMATION OPTIONS 
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

   
  

     const initalState = {
      input:'',
      imageUrl:'',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id:'',
        name:'',
        email:'',
        entries:'',
        date: ''
      }
    };

class App extends Component {
//init state of app component
  constructor(){
    super();
    this.state = initalState; 
  }

// Loading user method
  loadUser = (data)=>{
    this.setState({user: {
      id:data.id,
      name:data.name,
      email:data.email,
      entries:data.entries,
      date: data.date
    }});
  }

//Changing route method
  onRouteChange = (route) => {
      if(route === 'home')
        this.setState({isSignedIn:true});
      else if (route === 'signout')
        this.setState(initalState);
      this.setState({route:route});
  }

// Calculating points of rectangle around face  
  calculateFaceLocation = (data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    
    const height = Number(image.height);
    return {
      leftCol:clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    } 
  }
// Set state of box to have points of rectangle
  displayFaceBox = (box) => {
    this.setState({box:box});
  }



//set state of input url
  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }
//set state of image url
  onButtonSubmit = () => {
    this.setState({imageUrl:this.state.input});

    // using ML api method for detect face
      
    fetch('https://immense-cove-34629.herokuapp.com/imageurl',{
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body : JSON.stringify({
            input: this.state.input
          })
        })
      .then(response=>response.json())
      .then(response=>{
        if(response){
        fetch('https://immense-cove-34629.herokuapp.com/image',{
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body : JSON.stringify({
            id: this.state.user.id
          })
        }).then(response => response.json()).then(data => {
          this.setState({user: data});
        }).catch(console.log);
        }

      this.displayFaceBox(this.calculateFaceLocation(response));
    }).catch((e) => e.printStackTrace());
  };

    render(){
      const {imageUrl, box, isSignedIn,route} = this.state;
  return (
    <div className="App">
         <Particles className="particles" params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' ?
             <div>
             <Logo/>
             <Rank name={this.state.user.name} entries={this.state.user.entries}/>
             <ImageLinkForm  onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
             <FaceRecognition box={box} imageUrl={imageUrl}/>
             </div>
        : 
        route === 'signin' ?
        <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        :
        <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>

        }
 
        </div>
  );
}
}
export default App;
