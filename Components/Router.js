import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

import HomePage from '../Components/HomePage.js';
import JoyStick from '../Components/ControlPagebyJoyStick.js';

export const HomeStack = StackNavigator({
    HomesScreen:{
        screen: HomePage
    },
    JoyStick:{
        screen: JoyStick
    }
})