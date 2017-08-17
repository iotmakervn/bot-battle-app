
import React, { Component } from 'react';
import { AppRegistry,Text, View } from 'react-native';
import App from './App.js';

export default class JoyStick extends Component {

  render(){
    return(
      <App/>
    )
  }
}
AppRegistry.registerComponent('JoyStick', () => JoyStick);
