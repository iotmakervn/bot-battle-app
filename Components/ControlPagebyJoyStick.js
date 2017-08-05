import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Image, Animated, PanResponder } from 'react-native';
import Orientation from 'react-native-orientation';
import Button from 'apsl-react-native-button';
import JoyStick_Background from '../images/joystick_background.png';
import JoyStick_Thumb from '../images/joystick_thumb.png';

export default class ControlPage extends React.Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);    
    this.state = {
      marginLeft : new Animated.Value(48),
      marginTop : new Animated.Value(48),
      text: false
    }
    
  }
  componentWillMount(){
    Orientation.lockToLandscape();
  }

  _disconnect(){

  }

  componentWillReceiveProps(nextProps) {
    
  }

  render(){
    const {params} = this.props.navigation.state
    return(
      <View style = {{flexDirection:'column'}}>
          <StatusBar hidden={true} />
        <View style = {styles.container}>
             <Text style ={{fontSize:40}}> </Text> 
            <View style ={{width:100, marginTop: 7, marginRight: 5}}>
              <Button onPress ={this._disconnect()}>Disconnect</Button>
            </View>
        </View>
        <View style = {{flexDirection: 'row'}}>
          <JoyStick/>
          <ControlSkills/>
        </View>  
      </View>
    );
  }
}

class JoyStick extends Component {
  constructor(props){
    super(props)
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove:this._onPanResponderMove.bind(this),
      onPanResponderRelease: this._onPanResponderRelease.bind(this),
    })
    this.state = {
      x: null,
      y: null,
      position: new Animated.ValueXY()
    }
  }

  _position(_x,_y){
    const {position} = this.state
    if(Math.abs(_x)>86 || Math.abs(_y)>86 ){
      var cornerY = Math.atan(_x/_y)
      var x = Math.sin(cornerY)*85
      var y = Math.cos(cornerY)*85
      if(_y<0){
        x = -x
        y = -y
      }
      position.setValue({x: x, y: y})
    } else {
      position.setValue({x: _x, y: _y})
    }
  }
  _onPanResponderMove(event, gestureState){
    const {position} = this.state
    // var x = gestureState.dx, y = gestureState.dy
    this._position(gestureState.dx, gestureState.dy)
    // position.setValue({x: x, y: y})
  }

  _onPanResponderRelease(event, gestureState){
    const {position} = this.state
    position.setValue(gestureState.stateID)
  }

  render(){
    const {marginLeft,marginTop} = this.state
      return(
        <View style ={{marginTop: 90, marginLeft: 50,}}>
          <Image source = {JoyStick_Background}
                  style ={{alignItems:'center',justifyContent:'center'}}      
          >
            <View {...this.panResponder.panHandlers}>
                <Animated.Image source = {JoyStick_Thumb}
                                style = {this.state.position.getLayout()}
                />  
            </View>
          </Image>
        </View>
      )
  }
}

class ControlSkills extends Component{
  constructor(props){
    super(props)
    this.state = {
      data: ''
    }
  }
  render(){
    return(
      <View style = {{width: 200, height: 180, flexDirection:'column',backgroundColor: 'yellow', marginTop:90, marginLeft: 150}}>
        <View style = {{flexDirection:'row', justifyContent:'space-between'}}>
          <Circle onPress = {() => this.setState({data: 'AQ=='})}>
            <Text style = {{fontSize:30}}>Q</Text>
          </Circle>
          <Circle>
            <Text style = {{fontSize:25}}>W</Text>
          </Circle>
        </View>
        <View style = {{flexDirection:'row', justifyContent:'space-between'}}>
          <Circle>
            <Text style = {{fontSize:25}}>E</Text>
          </Circle>
          <Circle>
            <Text style = {{fontSize:25}}>R</Text>
          </Circle>
        </View>
      </View>
    )
  }
}

var Circle = ({children, onPress}) => (
    <TouchableOpacity onPress = {onPress}>
      <View style ={styles.circle}>
        <Text>{children}</Text>
      </View>
    </TouchableOpacity>
)

var data = ['AQ==','Ag==','Aw==','BA==','BQ==','BQ==']

const styles = StyleSheet.create({
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50/2,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent:'center',
    margin: 20
  },
  container:  {flexDirection: 'row', borderBottomWidth: 3, justifyContent: 'space-between', alignItems: 'center'},
})