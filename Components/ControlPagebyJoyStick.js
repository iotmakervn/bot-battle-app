import React, { Component } from 'react';
import {StyleSheet, Text, View, StatusBar, TouchableOpacity, Image, Animated, PanResponder, TouchableHighlight} from 'react-native';
import Orientation from 'react-native-orientation';
import Button from 'apsl-react-native-button';
import JoyStick_Background from '../images/joystick_background.png';
import JoyStick_Thumb from '../images/joystick_thumb.png';
import {BleManager} from 'react-native-ble-plx';


export default class ControlPage extends React.Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props)
    var data =''    
    this.state = {
    }
    this.manager = new BleManager()
  }
  componentWillMount(){
    Orientation.lockToLandscape();
  }

  render(){
    const {params} = this.props.navigation.state
    return(
      <View style = {{flexDirection:'column'}}>
          <StatusBar hidden={true} />
        <View style = {styles.container}>
          <View>
            <Image
              style={{width: 100, height: 50, margin: 5}}
              source={require('../images/iot_maker_logo.png')}
            />
          </View>
          <Text style ={{fontSize:40, color: '#DF7401',fontWeight:'bold'}}>Bot-Control</Text> 
          <TouchableHighlight 
            style = {styles.button} 
            onPress = {()=>{ this.manager.cancelDeviceConnection(params.info[0].deviceID), Orientation.unlockAllOrientations(), Orientation.lockToPortrait(),this.props.navigation.goBack()}}
          >
            <Text>Disconnect</Text>
          </TouchableHighlight>
        </View>
        <View style = {{flexDirection: 'row'}}>
          <JoyStick info = {params.info}/>
          <ControlSkills info = {params.info}/>
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
    this.manager = new BleManager()
  }

  sendData(dat){
    var {info} = this.props
    this.manager.writeCharacteristicWithoutResponseForDevice(info.deviceID, info.serviceUUID,info.uuid, dat)
  }

  _position(_x,_y){
    const {position} = this.state
    if(Math.abs(_x)>86 || Math.abs(_y)>86 ){
      var cornerY = Math.atan(_x/_y)
      x = Math.sin(cornerY)*85
      y = Math.cos(cornerY)*85
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
    this._position(gestureState.dx, gestureState.dy)
    if((-60)<position.x._value&& position.x._value<(60)&& position.y._value<(0)){
      this.sendData('AQ==')
    }
    if((-60)<position.x._value&& position.x._value<(60)&& position.y._value>(0)){
      this.sendData('Aw==')
    }
    if((-60)<position.y._value&& position.y._value<(60)&& position.x._value>(0)){
      this.sendData('BA==')
    }
    if((-60)<position.y._value&& position.y._value<(60)&& position.x._value<(0)){
      this.sendData('Ag==')
    }
  }
  _onPanResponderRelease(event, gestureState){
    const {position} = this.state
    this.sendData('BQ==')
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
    var data  = ''
    this.state = {
      
    }
    this.manager = new BleManager()
  }
  sendData(dat){
    var {info} = this.props
    this.manager.writeCharacteristicWithoutResponseForDevice(info.deviceID, info.serviceUUID,info.uuid, dat)
  }
  render(){
    return(
      <View style = {{flexDirection:'column', marginTop:45, marginLeft: 150}}>
         <View style = {{flexDirection:'row'}}> 
          <Circle onPress = {()=> {this.sendData('Fg==')}} style = {{marginLeft: 53,marginTop:48, marginRight: 20}}>
            <Text style = {styles.textiInCircle}>W</Text>
          </Circle>
          <Circle onPress = {()=> {this.sendData('Eg==')}} style = {{marginTop: 10}}>
            <Text style = {styles.textiInCircle}>E</Text>
          </Circle>
        </View>
        <View style = {{flexDirection:'row'}}>
          <Circle onPress = {()=> {this.sendData('Bg==')}} style = {{marginLeft:10 ,marginRight:60, marginTop: 12}}>
            <Text style = {styles.textiInCircle}>Q</Text>
          </Circle>
          <Circle onPress = {()=> {this.sendData('CQ==')}} style = {{marginTop: 12}}>
            <Text style = {styles.textiInCircle}>R</Text>
          </Circle>
        </View>
      </View>
    )
  }
}

var Circle = ({children, onPress, style}) => (
    <TouchableOpacity onPressIn = {onPress} style ={style}>
      <View style ={styles.circle}>
        <Text>{children}</Text>
      </View>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'lightgoldenrodyellow',
    alignItems: 'center',
    justifyContent:'center',
  },
  container:  {
    flexDirection: 'row', 
    borderBottomWidth: 3, 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  button: {
    borderRadius: 5,
    backgroundColor: 'orange',
    padding: 10,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 45,
    borderWidth:1,
    borderColor:'#FFFF00'
  },
  textiInCircle: {
    fontSize:35, 
    fontWeight:'bold'
  }

})