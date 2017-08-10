import React, { Component } from 'react';
import {StyleSheet, Text, View, StatusBar, TouchableOpacity, Image, Animated, PanResponder, TouchableHighlight,BackHandler} from 'react-native';
import Orientation from 'react-native-orientation';
import Button from 'apsl-react-native-button';
import JoyStick_Background from '../images/joystick_background.png';
import JoyStick_Thumb from '../images/joystick_thumb.png';
import {BleManager} from 'react-native-ble-plx';


export default class ControlPage extends React.Component {

  static navigationOptions = {
    header: null
  };

  constructor(props){
    super(props)
    var data =''   
    this.state = {
    }
    this.manager = new BleManager()
    this.handleBackButton = this.handleBackButton.bind(this)
  }
  componentWillMount(){
    Orientation.lockToLandscape();
  }

  _disconnect(deviceID){
    this.manager.cancelDeviceConnection(deviceID)
    Orientation.lockToPortrait()
    this.props.navigation.goBack()
  }

  render(){
    const {params} = this.props.navigation.state
    // this.manager.onDeviceDisconnected(params.info.deviceID,(error,device)=>{
    //   this._disconnect(device.id)
    // })
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
          <Text style ={{fontSize:40, color: '#DF7401',fontWeight:'bold'}}>{params.name}</Text> 
          <TouchableHighlight 
            style = {styles.button} 
            onPress = {this._disconnect.bind(this,params.info.deviceID)}
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
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    return true;
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
    if(Math.abs(_x)>85 || Math.abs(_y)>85 ){
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
    const {touches} = event.nativeEvent
    for(var i in touches){
      if (i>0){
        console.log(touches[i].locationX)
        if((touches[1].locationX=1420) && (touches[1].locationXY = 590)){
          this.sendData('CQ==')
        }
      }
    }
    this._position(gestureState.dx, gestureState.dy)
    if((-60)<=position.x._value&& position.x._value<=(60)&& position.y._value<(0)){
      this.sendData('AQ==')
    }
    if((-60)<=position.x._value&& position.x._value<=(60)&& position.y._value>(0)){
      this.sendData('Aw==')
    }
    if((-60)<=position.y._value&& position.y._value<=(60)&& position.x._value>(0)){
      this.sendData('BA==')
    }
    if((-60)<=position.y._value&& position.y._value<=(60)&& position.x._value<(0)){
      this.sendData('Ag==')
    }
    console.log(event.nativeEvent)
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
      reverse: 'OFF'
    }
    this.manager = new BleManager()
  }
  sendData(dat){
    var {info} = this.props
    this.manager.writeCharacteristicWithoutResponseForDevice(info.deviceID, info.serviceUUID,info.uuid, dat)
  }
  render(){
    return(
      <View style = {{flexDirection:'column', marginTop:20, marginLeft: 30}}>
        <View style = {{flexDirection:'row'}}>
          <Rectangle onPress = {()=> {this.sendData('Eg==')}} style={{marginLeft: 30}}>
            <Text  style = {styles.textiInRectangle}>{this.state.reverse}</Text>
          </Rectangle>
          <Rectangle onPress = {()=> {this.sendData('Bg==')}} style = {{marginLeft:20}}>
            <Text style = {styles.textiInRectangle}>Q'</Text>
          </Rectangle>
        </View>  
        <View style = {{flexDirection:'row'}}> 
          <Circle onPressIn = {()=> {this.sendData('CQ==')}} 
                  onPressOut = {()=> {this.sendData('Cw==')}}
                  style = {{marginLeft: 180,marginTop:48, marginRight: 20}}>
            <Text style = {styles.textiInCircle}>W</Text>
          </Circle>
          <Circle onPressIn = {()=> {this.sendData('DA==')}} 
                  onPressOut = {()=> {this.sendData('DQ==')}}
                  style = {{marginTop: 10}}>
            <Text style = {styles.textiInCircle}>E</Text>
          </Circle>
        </View>
        <View style = {{flexDirection:'row'}}>
          <Circle onPress = {()=> {this.sendData('Bw==')}} style = {{marginLeft:135 ,marginRight:60, marginTop: 12}}>
            <Text style = {styles.textiInCircle}>Q</Text>
          </Circle>
          <Circle onPressIn = {()=> {this.sendData('EA==')}} 
                  onPressOut = {()=> {this.sendData('EQ==')}} 
                  style = {{marginTop: 12}}>
            <Text style = {styles.textiInCircle}>R</Text>
          </Circle>
        </View>
      </View>
    )
  }
}

var Circle = ({children, onPress, style, onPressIn, onPressOut}) => (
    <TouchableOpacity onPress = {onPress} style ={style} onPressIn ={onPressIn} onPressOut = {onPressOut}>
      <View style ={styles.circle}>
        <Text>{children}</Text>
      </View>
    </TouchableOpacity>
)

var Rectangle = ({children, onPress, style}) => (
    <TouchableOpacity onPress = {onPress} style ={style} >
      <View style ={styles.rectangle}>
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
  },
  rectangle: {
    borderRadius: 5,
    backgroundColor: 'lightgoldenrodyellow',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 50,
  },
  textiInRectangle: {
    fontSize:16, 
    fontWeight:'bold'
  }
})