import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

import HomePage from '../Components/HomePage.js';
import ControlPage from '../Components/ControlPage.js';
import JoyStick from '../Components/ControlPagebyJoyStick.js';

export const HomeStack = StackNavigator({
    HomesScreen:{
        screen: HomePage
    },
    // ControlScreen:{
    //     screen: ControlPage
    // },
    JoyStick:{
        screen: JoyStick
    }
})