import React, { Component } from 'react';
import {StyleSheet, Text, View, StatusBar, TouchableOpacity, Image, Animated, PanResponder, TouchableHighlight,BackHandler} from 'react-native';
import Orientation from 'react-native-orientation';
import {BleManager} from 'react-native-ble-plx';
import JoyStick from './JoyStick.js';
import Skills from './Skills.js';

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

  _disconnect(deviceID){
    this.manager.cancelDeviceConnection(deviceID)
    this.props.navigation.goBack()
  }
  
  render(){
    const {params} = this.props.navigation.state
    // this.manager.onDeviceDisconnected(params.info.deviceID,(error,device)=>{
    //   this._disconnect(device.id)
    // })
    return(
      <View style = {{flexDirection:'column', backgroundColor: 'white'}}>
          <StatusBar hidden={true} />
        <View style = {styles.container}>
          <View>
            <Image
              style={{width: 100, height: 50, margin: 5}}
              source={require('../images/iot_maker_logo.png')}
            />
          </View>
          <Text style ={{fontSize:40, color: 'orange',fontWeight:'bold'}}>{params.name}</Text> 
          <TouchableHighlight 
            style = {styles.button} 
            onPress = {this._disconnect.bind(this,params.info.deviceID)}
            underlayColor='ivory'
          >
            <Text>Disconnect</Text>
          </TouchableHighlight>
        </View>
        <View style = {{flexDirection: 'row'}}>
          <JoyStick info = {params.info}/>
          <Skills info = {params.info}/>
        </View>         
      </View>
    );
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    Orientation.lockToLandscape();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    Orientation.unlockAllOrientations()
  }

  handleBackButton() {
    return true;
  }
}
const styles = StyleSheet.create({
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
})