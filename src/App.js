import React, { Component } from 'react';
import { Text, View } from 'react-native';
import {HomeStack} from './Components/Router';

export default class App extends Component {
  render(){
      return(
      <View style ={{flex: 1, justifyContent: 'center', alignItems:'stretch'}}>
        <HomeStack />
      </View>
      );
  }
}