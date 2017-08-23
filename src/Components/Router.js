import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

import HomePage from '../Components/HomePage.js';
import ControlPage from '../Components/ControlPage.js';

export const HomeStack = StackNavigator({
    HomePage:{
        screen: HomePage
    },
    ControlPage:{
        screen: ControlPage
    }
})