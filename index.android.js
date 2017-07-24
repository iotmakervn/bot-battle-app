

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, AccessibilityInfo, TouchableOpacity, Alert, PermissionsAndroid, FlatList,
        TouchableHighlight} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

export default class JoyStick extends Component {

  constructor(props){
    super(props);
    this.state = {
      devices: ""
    }
    this.manager = new BleManager();
  }

  info(message){
    this.setState({info: message})
  }

  _scan() {
  
    this.manager.startDeviceScan(null,null, (error, device) => {
      if (error){
        return
      }
      this.setState({devices:device.name})
    })
  }



  render() {  
    return ( 
      <View style = {styles.container}>
        <View style = {{borderBottomWidth:1,justifyContent:'center',alignItems:"center"}}>
          <Text style ={{fontSize:40}}>Device Scan</Text>
        </View>
          <View style = {{justifyContent:"flex-start", alignItems:"center"}}>
          <TouchableOpacity >
            <Text>{this.state.devices}</Text>
          </TouchableOpacity>
        </View>  
        {/* <FlatList
          data={this.state.devices}
          renderItem={({item}) => <Text>{item.name}</Text>}
        /> */}
        <View style = {styles.buttonContainer}>
          <TouchableOpacity onPress={this._scan()} underlayColor ="black">
            <View style ={{flex:1}}>
              <Text style ={{fontSize:40, borderRightWidth: 1}}>Scan </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View sytle = {{flex:1}}>
              <Text style ={{fontSize:40, borderLeftWidth: 1}}> Stop</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    ); 
  }

  

  componentWillUnMount(){
    this.manager.destroy()
    delete this.manager
  }
}

const styles = StyleSheet.create({
  container: {flex:1, justifyContent:'space-between', flexDirection:'column'},
  buttonContainer: {marginBottom:0, borderTopWidth:1, flexDirection:'row',justifyContent:'space-around',alignContent:'stretch'},

})
AppRegistry.registerComponent('JoyStick', () => JoyStick);
