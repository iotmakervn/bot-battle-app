import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Image, Animated } from 'react-native';
import Orientation from 'react-native-orientation';
import Button from 'apsl-react-native-button';

export default class ControlPage extends React.Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props){
    super(props)
    this.state = {
      x: null, y: null,
      marginLeft : new Animated.Value(48),
      marginTop : new Animated.Value(48)
    }
  }
  componentWillMount(){
    Orientation.lockToLandscape();
  }

  _disconnect(){
    
  }
  render(){

    const {marginLeft, marginTop} = this.state;
    return(
      <View style = {{flexDirection:'column'}}>
          <StatusBar hidden={true} />
        <View style = {styles.container}>
            <Text style ={{fontSize:40}}>Device Scan</Text>
            <View style ={{width:100, marginTop: 7, marginRight: 5}}>
              <Button onPress ={this._disconnect()}>Disconnect</Button>
            </View>
        </View>
        <View style = {{flexDirection: 'row'}}>
          <ControlMotion/>
          <ControlSkills/>
        </View>  
      </View>
    );
  }
}


class ControlMotion extends Component{
  render(){
    return(
      <View style = {{width: 200, height: 180, flexDirection:'column',backgroundColor: 'yellow', marginTop:90, marginLeft: 50, justifyContent:'space-between'}}>
        <View style = {{justifyContent:'center', alignItems:'center'}}>
          <Triangle/>
        </View>
        <View style = {{flexDirection:'row', justifyContent:'space-between', marginHorizontal: -30}}>
          <TriangleLeft/>
          <TriangleRight/>
        </View>
        <View style = {{justifyContent:'center', alignItems:'center'}}>
          <TriangleDown/>
        </View>
      </View>
    )
  }
}

class ControlSkills extends Component{
  render(){
    return(
      <View style = {{width: 200, height: 180, flexDirection:'column',backgroundColor: 'yellow', marginTop:90, marginLeft: 150}}>
        <View style = {{flexDirection:'row', justifyContent:'space-between'}}>
          <Circle>
            <Text style = {{fontSize:25}}>Q</Text>
          </Circle>
          <Circle>
            <Text style = {{fontSize:25}}>W</Text>
          </Circle>
        </View>
        <View style = {{flexDirection:'row', justifyContent:'space-between'}}>
          <Circle>
            <Text style = {{fontSize:25}}>E</Text>
          </Circle>
          <Circle>
            <Text style = {{fontSize:25}}>R</Text>
          </Circle>
        </View>
      </View>
    )
  }
}



var Circle = ({children}) => (
    <TouchableOpacity>
      <View style ={styles.circle}>
        <Text>{children}</Text>
      </View>
    </TouchableOpacity>
)

var Triangle = React.createClass({
  render: function() {
    return (
      <TouchableOpacity>
        <View style={[styles.triangle, this.props.style]} />
      </TouchableOpacity>
    )
  }
})

var TriangleDown = React.createClass({
  render: function() {
    return (
      <Triangle style={[styles.triangleDown, this.props.style]}/>
    )
  }
})

var TriangleLeft = React.createClass({
  render: function() {
    return (
      <Triangle style={[styles.triangleLeft, this.props.style]}/>
    )
  }
})

var TriangleRight = React.createClass({
  render: function() {
    return (
      <Triangle style={[styles.triangleRight, this.props.style]}/>
    )
  }
})

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height:0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 40,
    borderRightWidth: 40,
    borderBottomWidth: 35,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'red'
  },
  triangleDown: {
    transform: [
      {rotate: '180deg'}
    ]
  },
  triangleLeft: {
    height: 70,
    transform: [
      {rotate: '270deg'}
    ]
  },
  triangleRight: {
    height: 70,
    transform: [
      {rotate: '90deg'}
    ]
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50/2,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent:'center',
    margin: 20
  },
  container:  {flexDirection: 'row', borderBottomWidth: 3, justifyContent: 'space-between', alignItems: 'center'},
})