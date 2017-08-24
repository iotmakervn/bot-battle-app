
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, PanResponder, Animated, View, ImageBackground } from 'react-native';
import JoyStick_Background from '../images/joystick_background.png';
import JoyStick_Thumb from '../images/joystick_thumb.png';
import { BleManager } from 'react-native-ble-plx';

export default class JoyStick extends React.Component {
	constructor(props) {
		super(props)
		this.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: (event, gestureState) => true,
			onMoveShouldSetPanResponder: (evt, gestureState) => true,
			onPanResponderGrant: this._onPanResponderGrant.bind(this),
			onPanResponderMove: this._onPanResponderMove.bind(this),
			onPanResponderRelease: this._onPanResponderRelease.bind(this),
		})
		this.state = {
			position: new Animated.ValueXY(),
			x: 0,
			y: 0,
			distance: 0
		}
		this.handleResponder = this.handleResponder.bind(this)
	}

	handleResponder(distance, x, y, release) {
		if (this.props.onPan) {
			this.props.onPan(distance, x, y, release)
		}
	}

	_position(_x, _y) {
		var { position, x, y } = this.state
		const { centerX, centerY } = this.state
		var cornerY = Math.atan(_x / _y)
		if (Math.abs(_x) > 80 || Math.abs(_y) > 80) {
			x = Math.sin(cornerY) * 85
			y = Math.cos(cornerY) * 85
			if (_y < 0) {
				x = -x
				y = -y
			}
			position.setValue({ x: x, y: y })
		} else {
			x = _x;
			y = _y;
			position.setValue({ x: x, y: y })
		}

		var corner = (cornerY / Math.PI) * 180
		var distance = Math.sqrt(x * x + y * y)

		// var distanceTemp = (Math.round(distance) << 8) | 117
		// console.log("distanceTemp", distance, x, y)
		this.handleResponder(distance, x, y, false)
	}

	_onPanResponderGrant(event, gestureState) {
		const { identifier } = event.nativeEvent
		const { touches } = event.nativeEvent
		const { position, x, y } = this.state
		this.setState({ x: touches[0].pageX, y: touches[0].pageY })
		this.setState({ centerX: touches[0].pageX, centerY: touches[0].pageY })
		if (identifier != 0) {
			position.setValue({ x: 0, y: 0 })
		}
	}

	_onPanResponderMove(event, gestureState) {
		const { position, x, y } = this.state
		const { touches, identifier } = event.nativeEvent
		this._position((touches[0].pageX - x), (touches[0].pageY - y))
	}

	_onPanResponderRelease(event, gestureState) {
		const { position } = this.state
		const { touches } = event.nativeEvent
		position.setValue(gestureState.stateID)
		this.handleResponder(0, 0, 0, true)
	}

	render() {
		return (
			<View style={{ marginTop: 90, marginLeft: 50, }}>
				<ImageBackground source={JoyStick_Background}
					style={[{ alignItems: 'center', justifyContent: 'center' }]}>
					<View {...this.panResponder.panHandlers} style={{ marginLeft: 40, marginTop: 40 }}>
						<Animated.Image source={JoyStick_Thumb}
							style={[this.state.position.getLayout(), styles.jumstickThumb]} />
					</View>
				</ImageBackground>
			</View>
		)
	}
}

JoyStick.propType = {
	info: PropTypes.array
}

const styles = StyleSheet.create({
	jumstickThumb: {
		width: 100,
		height: 100
	},
	imgBg: {
		marginLeft: 200,
		marginTop: 10
	}
})