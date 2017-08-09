import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, PermissionsAndroid, FlatList, Platform, TouchableHighlight, Image} from 'react-native';
import Orientation from 'react-native-orientation';
import {BleManager} from 'react-native-ble-plx';

export default class HomePage extends React.Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props);
    this.state = {
      devices: [],
      service: [],
      characteristic: []
    }
    this.manager = new BleManager();
    this._scan = this._scan.bind(this);
  }

  componentWillMount(){
    Orientation.lockToPortrait();
    if (Platform.OS === 'ios') {
        this.manager.onStateChange((state) => {
          if (state === 'PoweredOn') this._scan()
        })
      } else {
        this._scan()
      }
  } 


  componentWillUnMount(){
    this.manager.destroy()
    delete this.manager
  }

  _scan(){
    var {devices}= this.state;
    if (this.state.devices.length != 0){
      this.setState({devices:[]})
    }
    this.manager.startDeviceScan(null,null, (error, device) => {
      if (error){
        return
      }
      if(device.name != null){
        devices.unshift({
          name: device.name,
          id: device.id,
          rssi: device.rssi,
        })
      }
      this.setState({devices})
    })
  }

  _connect(deviceID,deviceName){
    var info = []
    var characteristicForWrite = []
    this.manager.stopDeviceScan()
    this.manager.connectToDevice(deviceID)
      .then(function(device){
        return device.discoverAllServicesAndCharacteristics()
      })
      .then((device) => {
        device.services()
          .then((services)=>{
            return device.characteristicsForService(services[2].uuid)
          })
        .then((characteristics) => {
          for(var i in characteristics){
            if(characteristics[i].isWritableWithResponse === true)
              characteristicForWrite = characteristics[i]
          }
          console.log(characteristicForWrite)
          return this.props.navigation.navigate('JoyStick',{info: characteristicForWrite, name: deviceName})
        })
      })
  }

  keyExtractor = (item, index) => [item.name,item.id]

  renderFlatListItem(item){
    return(
      <View style ={styles.deviceList}>
        <View style ={{margin: 5}}>
          <Text style = {{fontSize:20}}>{item.name}</Text>
          <Text style = {{fontSize:13}}>{item.id}</Text>
        </View>
        <TouchableHighlight onPress = {this._connect.bind(this,item.id,item.name)} style ={styles.button}>
          <Text>Connect</Text>
        </TouchableHighlight>
      </View>
	  )
  }

  render(){
    return(
      <View>
          <View style = {styles.container}>
            <View>
              <Image
                style={{width: 100, height: 50, margin: 5}}
                source={require('../images/iot_maker_logo.png')}
              />
            </View>
            <TouchableHighlight style = {styles.button} onPress = {this._scan.bind(this)}>
              <Text>Scan</Text>
            </TouchableHighlight>
          </View>
          <View style = {{flexDirection:'row', justifyContent:'space-between'}}> 
            <FlatList
              data={this.state.devices}
              extraData={this.state}
              keyExtractor={this.keyExtractor}
              renderItem={({item}) => this.renderFlatListItem(item)}
            />
          </View>
      </View>
    ); 
  }
  
  componentDidMount(){
    if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
            if (result) {
              console.log("Permission is OK");
            } else {
              PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                  console.log("User accept");
                } else {
                  console.log("User refuse");
                }
              });
            }
      });
    }
  }
}


const styles = StyleSheet.create({
  container:  {
    flexDirection: 'row', 
    borderBottomWidth: 3, 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  deviceList: {
    flex: 1,
    flexDirection:'row', 
    borderBottomWidth: 1,
    justifyContent:'space-between', 
    alignContent:'center'
  },
  button: {
    borderRadius: 5,
    backgroundColor: 'orange',
    padding: 10,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 45,
    borderWidth:1,
    borderColor:'#FFFF00'
  }
})