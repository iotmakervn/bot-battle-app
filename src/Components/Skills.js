import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import Reverse from '../images/reverse-icon-9590.png';
import JoyStickBtn from './JoyStickBtn';

export default class Skills extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			reverse: 'OFF',
			state: 1
		}
	}
	render() {
		return (
			<View style={{ flexDirection: 'column', marginTop: 20, marginLeft: 30 }}>
				<View style={{ flexDirection: 'row' }}>
					<JoyStickBtn style={{ marginLeft: 30 }} text="OFF" revert="ON" type="rect" onPress={this.props.onPress} />
					<JoyStickBtn style={{ marginLeft: 20 }} text="RELOAD" type="rect" onPress={this.props.onPress}>
						<Image source={Reverse} style={{ width: 40, height: 40, marginTop: 4 }} />
					</JoyStickBtn>
				</View>
				<View style={{ flexDirection: 'row' }}>
					<JoyStickBtn style={{ marginLeft: 180, marginTop: 48, marginRight: 20 }} text="W" onPress={this.props.onPress} />
					<JoyStickBtn style={{ marginTop: 10 }} text="E" onPress={this.props.onPress} />
				</View>
				<View style={{ flexDirection: 'row' }}>
					<JoyStickBtn style={{ marginLeft: 135, marginRight: 60, marginTop: 12 }} text="Q" onPress={this.props.onPress} />
					<JoyStickBtn style={{ marginTop: 12 }} text="R" onPress={this.props.onPress} />
				</View>
			</View>
		)
	}

}

Skills.propType = {
	info: PropTypes.array
}


var Rectangle = ({ children, onPress, style }) => (
	<TouchableOpacity onPress={onPress} style={style} >
		<View style={styles.rectangle}>
			<Text>{children}</Text>
		</View>
	</TouchableOpacity>
)

const styles = StyleSheet.create({
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
		fontSize: 18,
		fontWeight: 'bold'
	},
})