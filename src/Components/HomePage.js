import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  FlatList,
  Platform,
  TouchableHighlight,
  Image,
  StatusBar,
  BackHandler
} from 'react-native';
import Orientation from 'react-native-orientation';
import { BleManager } from 'react-native-ble-plx';


export default class HomePage extends React.Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    console.log(this.props.navigation.state)
    this.state = {
      devices: new Array(),
      service: [],
      characteristic: [],
      refresh: false,
      connectButton: 'Connect',
      pressed: false
    }
    this.manager = this.props.screenProps.ble;
    this._scan = this._scan.bind(this);
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', function () {
      BackHandler.exitApp();
    })
    Orientation.lockToPortrait();
  }
  componentWillMount() {
    if (Platform.OS === 'ios' && !this.props.navigation.state.params) {
      this.manager.onStateChange((state) => {
        console.log(state);
        if (state === 'PoweredOn') this._scan()
      })
    } else {
      this._scan()
    }
  }

  _scan() {
    var { devices } = this.state;
    //this.setState({devices: [], refresh: true})
    if (devices.length != 0) { //clear devices array
      devices.length = 0
      this.setState({ devices })
    }
    if (this.state.pressed) {
      this.setState({ pressed: false })
    }
    this.manager.stopDeviceScan();
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        return
      }
      let found = false;
      if (!devices.find(o => o.id == device.id) && device.name) {
        devices.unshift({
          name: device.name,
          id: device.id,
          rssi: device.rssi,
          key: device.id
        })
      }
      this.setState({ devices, refresh: false })
      // console.log(this.state.devices)
    })
  }

  _connect(deviceID, deviceName) {
    console.log(deviceID, deviceName)

    this.props.navigation.navigate('ControlPage', { name: deviceName, id: deviceID })
    this.setState({ pressed: true })
  }

  keyExtractor = (item, index) => [item.name, item.id]

  renderFlatListItem(item) {
    return (
      <View style={styles.deviceList}>
        <View style={{ margin: 5 }}>
          <Text style={{ fontSize: 20 }}>{item.name}</Text>
          <Text style={{ fontSize: 13 }}>{item.id}</Text>
        </View>
        <TouchableHighlight underlayColor='ivory' onPress={this._connect.bind(this, item.id, item.name)} style={styles.button} disabled={this.state.pressed}>
          <Text>{this.state.connectButton}</Text>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
      <View>
        <StatusBar hidden={true} />
        <View style={styles.container}>
          <View>
            <Image
              style={{ width: 100, height: 50, margin: 5 }}
              source={require('../images/iot_maker_logo.png')}
            />
          </View>
          <TouchableHighlight underlayColor='ivory' style={styles.button} onPress={this._scan.bind(this)}>
            <Text>Scan</Text>
          </TouchableHighlight>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <FlatList
            refreshing={this.state.refresh}
            onRefresh={this._scan}
            data={this.state.devices}
            extraData={this.state}
            keyExtractor={this.keyExtractor}
            renderItem={({ item }) => this.renderFlatListItem(item)}
          />
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceList: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    alignContent: 'center'
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
    borderWidth: 1,
    borderColor: '#FFFF00'
  }
})