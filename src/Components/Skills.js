import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import Reverse from '../images/reverse-icon-9590.png';

export default class Skills extends React.Component{
	constructor(props){
		super(props)
		var data  = ''
		this.state = {
			reverse: 'OFF',
			state: 1
		}
		this.manager = new BleManager()
	}
	sendData(dat){
		var {info} = this.props
		this.manager.writeCharacteristicWithoutResponseForDevice(info.deviceID, info.serviceUUID,info.uuid, dat)
	}

	render(){
		return(
			<View style = {{flexDirection:'column', marginTop:20, marginLeft: 30}}>
				<View style = {{flexDirection:'row'}}>
					<Rectangle 
						onPress = {()=> {
							this.sendData('Eg==')
							var {reverse} = this.state
							if(reverse === 'OFF'){
								reverse = 'ON'
							}else {
								reverse ='OFF'
							}
							this.setState({reverse})     
						}} 
						style={{marginLeft: 30}}
					>
						<Text  style = {styles.textInRectangle}>{this.state.reverse}</Text>
					</Rectangle>
					<Rectangle onPress = {()=> {this.sendData('GQ==')}} style = {{marginLeft:20}}>
						<Image source = {Reverse} style = {{width: 100, height: 100}}/>
					</Rectangle>
				</View>  
				<View style = {{flexDirection:'row'}}> 
					<Circle onPress = {this.sendData('CQ==')}
									style = {{marginLeft: 180,marginTop:48, marginRight: 20}}>
						<Text style = {styles.textInCircle}>W</Text>
					</Circle>
					<Circle onPress ={this.sendData('Eg==')}
									style = {{marginTop: 10}}>
						<Text style = {styles.textInCircle}>E</Text>
					</Circle>
				</View>
				<View style = {{flexDirection:'row'}}>
					<Circle onPress = {()=> {this.sendData('Bw==')}} style = {{marginLeft:135 ,marginRight:60, marginTop: 12}}>
						<Text style = {styles.textInCircle}>Q</Text>
					</Circle>
					<Circle onPress = {this.sendData('Fg==')}
									style = {{marginTop: 12}}>
						<Text style = {styles.textInCircle}>R</Text>
					</Circle>
				</View>
			</View>
		)
	}
}

Skills.propType = {
  info: React.PropTypes.array
}


var Circle = ({children, onPress, style, onPressIn, onPressOut}) => (
	<TouchableOpacity onPress = {onPress} style ={style} onPressIn ={onPressIn} onPressOut = {onPressOut}>
		<View style ={styles.circle}>
			<Text>{children}</Text>
		</View>
	</TouchableOpacity>
)

var Rectangle = ({children, onPress, style}) => (
	<TouchableOpacity onPress = {onPress} style ={style} >
		<View style ={styles.rectangle}>
			<Text>{children}</Text>
		</View>
	</TouchableOpacity>
)

const styles = StyleSheet.create({
	circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'mediumseagreen',
    alignItems: 'center',
    justifyContent:'center',
	},
	textInCircle: {
    fontSize:35, 
    fontWeight:'bold'
	},
	rectangle: {
    borderRadius: 5,
    backgroundColor: 'mediumseagreen',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 50,
  },
  textInRectangle: {
    fontSize:18, 
    fontWeight:'bold'
  },
})