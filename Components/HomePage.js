import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, PermissionsAndroid, FlatList, Platform} from 'react-native';
import Orientation from 'react-native-orientation';
import {BleManager} from 'react-native-ble-plx';
import Button from 'apsl-react-native-button';

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
    this._write = this._write.bind(this)
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

  _connect(selectedID){
    var {service,characteristic, devices} = this.state
    var info = []
    this.manager.stopDeviceScan()
    this.manager.connectToDevice(selectedID)
      .then(function(device){
        return device.discoverAllServicesAndCharacteristics()
      })
      .then((device) => {
        device.services()
          .then((services)=>{
            service = services
            this.setState({service})
            console.log(service[2])
            return device.characteristicsForService(this.state.service[2].uuid)
        })
        .then((characteristics) => {
          characteristic = characteristics
          console.log(characteristic[0])
          this.setState({characteristic})
          return this.props.navigation.navigate('JoyStick',{info: this.state.characteristic})
        })
      })
  }

  _write(){
    var {devices, service, characteristic} = this.state
    this.manager.writeCharacteristicWithoutResponseForDevice(devices[0].id,service[2].uuid,characteristic[0].uuid,'AQ==')
  }

  keyExtractor = (item, index) => [item.name,item.id]

  renderFlatListItem(item){
    return(
      <View style ={styles.deviceList}>
        <View style ={{margin: 5}}>
          <Text style = {{fontSize:20}}>{item.name}</Text>
          <Text style = {{fontSize:13}}>{item.id}</Text>
        </View>
        <View style ={{width:85, marginTop: 7, marginRight: 5}}>
           <Button style={{backgroundColor: 'orange'}} textStyle={{fontSize: 18}} onPress = {this._connect.bind(this,item.id)}> 
            Connect
          </Button>
        </View>
      </View>
	  )
  }

  render(){
    return(
      
      <View>
          <View style = {styles.container}>
            <Text style ={{fontSize:40}}>Device Scan</Text>
            <View style ={{width:85, marginTop: 7, marginRight: 5}}>
              <Button onPress ={this._scan}>Scan</Button>
            </View>
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
  container:  {flexDirection: 'row', borderBottomWidth: 3, justifyContent: 'space-between', alignItems: 'center'},
  deviceList: {flex: 1,flexDirection:'row', borderBottomWidth: 1,justifyContent:'space-between', alignContent:'center'}
})