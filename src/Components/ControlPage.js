import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, TouchableHighlight, BackHandler } from 'react-native';
import Orientation from 'react-native-orientation';
import { BleManager } from 'react-native-ble-plx';
import JoyStick from './JoyStick';
import Skills from './Skills';
import BotCommnad from '../BotCommand';

export default class ControlPage extends React.Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props)
    var data = ''
    const { params } = this.props.navigation.state
    this.state = {
      params: params
    }
    this.manager = this.props.screenProps.ble
    this.onJoystickBtnClick = this.onJoystickBtnClick.bind(this)
    this.onJoystickPan = this.onJoystickPan.bind(this)
    this.left_speed = 0;
    this.right_speed = 0;
    this.send_done = true;
  }

  _disconnect(deviceID) {
    this.manager
      .cancelDeviceConnection(deviceID)
      .then((err) => {
        this.props.navigation.navigate('HomePage', {})
      })
      .catch((e) => {
        console.log(e);
      })
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton)
  }

  onJoystickPan(distance, x, y, release) {
    if (release) {
      return this.write(BotCommnad.turn_off(), true)
    }
    let absx = Math.abs(x), absy = Math.abs(y)
    let dxLeft = absx, dxRight = absx, dy = absy;
    if (x < 0) {
      dxLeft += 85
      dxRight = 85 * 2 - dxLeft
    } else {
      dxRight += 85
      dxLeft = 85 * 2 - dxRight
    }

    let leftDis = Math.sqrt(dxLeft * dxLeft + dy * dy)
    let righDis = Math.sqrt(dxRight * dxRight + dy * dy)
    let theta_rad = Math.atan2(y, x);
    let theta_deg = (theta_rad / Math.PI * 180) + (theta_rad > 0 ? 0 : 360);
    let left_speed = 0;
    let right_speed = 0;
    if (theta_deg < 355 && theta_deg > 270) {
      left_speed = 15;
      right_speed = 360 - theta_deg;
      right_speed /= 3;
      right_speed -= 15;
    } else if (theta_deg < 270 && theta_deg > 185) {
      right_speed = 15;
      left_speed = theta_deg - 180;
      left_speed /= 3;
      left_speed -= 15;
    } else if (theta_deg < 175 && theta_deg > 90) {
      right_speed = -15;
      left_speed = theta_deg - 90;
      left_speed /= 3;
      left_speed -= 15;
    } else if (theta_deg < 90 && theta_deg > 5) {
      left_speed = -15;
      right_speed = theta_deg;
      right_speed /= 3;
      right_speed = 15 - right_speed;
    }
    left_speed = Math.floor(left_speed * distance / 75)
    right_speed = Math.floor(right_speed * distance / 75)


    if (left_speed != this.left_speed) {
      this.left_speed = left_speed;
      let left_fw = 1;
      if (left_speed < 0) {
        left_fw = 0;
      }
      let absleft = Math.abs(left_speed)
      if (absleft > 15)
        absleft = 15
      this.write(BotCommnad.left(left_fw, absleft))
    }

    if (right_speed != this.right_speed) {
      this.right_speed = right_speed;
      let right_fw = 1;
      if (right_speed < 0) {
        right_fw = 0;
      }
      let absright = Math.abs(right_speed)
      if (absright > 15)
        absright = 15
      this.write(BotCommnad.right(right_fw, absright))
    }
    // console.log(distance, left_speed, right_speed);
    /* Write here */
    // console.log(BotCommnad.move_forward(10))
  }

  onJoystickBtnClick(text) {
    console.log(text);

    this.write(BotCommnad.skill_from_str(text))
    /* Write here */
    // console.log(BotCommnad.move_forward(10))
  }

  write(data, force) {
    let info = this.state.params.info;
    let self = this;
    if (!force && this.send_done == false) {
      return;
    }
    this.send_done = false;
    this.manager.writeCharacteristicWithResponseForDevice(
      info.deviceID,
      info.serviceUUID,
      info.uuid,
      data)
      .then((data) => {
        self.send_done = true;
      })
  }
  render() {

    const params = this.state.params
    return (
      <View style={{ flexDirection: 'column', backgroundColor: 'white' }}>
        <StatusBar hidden={true} />
        <View style={styles.container}>
          <View>
            <Image
              style={{ width: 100, height: 50, margin: 5 }}
              source={require('../images/iot_maker_logo.png')}
            />
          </View>
          <Text style={{ fontSize: 40, color: 'orange', fontWeight: 'bold' }}>{params && params.name || "..."}</Text>
          <TouchableHighlight
            style={styles.button}
            onPress={this._disconnect.bind(this, params && params.info.deviceID)}
            underlayColor='ivory'>
            <Text>Disconnect</Text>
          </TouchableHighlight>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <JoyStick onPan={this.onJoystickPan} />
          <Skills onPress={this.onJoystickBtnClick} />
        </View>
      </View>
    );
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', function () {
      return true;
    });
    Orientation.lockToLandscape();
  }

  componentWillUnMount() {
    Orientation.unlockAllOrientations()
  }
}
const styles = StyleSheet.create({
  container: {
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
    borderWidth: 1,
    borderColor: '#FFFF00'
  },
})