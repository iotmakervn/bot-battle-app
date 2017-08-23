
import React, { Component } from 'react';
import {StyleSheet, PanResponder, Animated, View, Text, Image} from 'react-native';
import JoyStick_Background from '../images/joystick_background.png';
import JoyStick_Thumb from '../images/joystick_thumb.png';
import Reverse from '../images/reverse-icon-9590.png';
import {BleManager} from 'react-native-ble-plx';

export default class  JoyStick extends React.Component {
  constructor(props){
      super(props)
      this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: this._onPanResponderGrant.bind(this),
      onPanResponderMove:this._onPanResponderMove.bind(this),
      onPanResponderRelease: this._onPanResponderRelease.bind(this),
      })
      this.state = {
      status: 'BQ==',
      position: new Animated.ValueXY(),
      x: null,
      y: null,
      centerX: null,
      centerY: null
      }
      this.manager = new BleManager()
  }

  sendData(dat){
    var {info} = this.props
    var {status} = this.state
    if(dat != status){
      this.manager.writeCharacteristicWithoutResponseForDevice(info.deviceID, info.serviceUUID,info.uuid, dat)
      this.setState({status: dat})
    }
  }

  _position(_x,_y){
		var {position, x, y} = this.state
		const {centerX, centerY} = this.state
		var cornerY = Math.atan(_x/_y)
		if(Math.abs(_x)>80 || Math.abs(_y)>80 ){
			x = Math.sin(cornerY)*85
			y = Math.cos(cornerY)*85
		if(_y<0){
				x = -x
				y = -y
		}
		position.setValue({x: x, y: y})
		} else {
			x = _x;
			y = _y;
		position.setValue({x: x, y: y})
		}
		// if(_y===0){
		//   if(_x>0){
		//     this.sendData('BA==')
		//   }else{
		//     this.sendData('Ag==')
		//   }
		// }
		var corner = (cornerY/Math.PI)*180
		var distance = Math.sqrt(x*x + y*y)
		
		
		console.log(distance)
		console.log(Math.round(distance)<<8)
		var distanceTemp = (Math.round(distance)<<8) | 117
		console.log(distanceTemp)
		var encodedData = window.btoa(distanceTemp);

		if(_y<0){
			if((-45)<corner && corner<45){
					this.sendData('AQ==')
			}else if(_x>0){
					this.sendData('BA==')
			} else {
					this.sendData('Ag==')
			}
		}else {
			if((-45)<corner && corner<45){
					this.sendData('Aw==')
			}else if(_x>0){
					this.sendData('BA==')
			} else {
					this.sendData('Ag==')
			}
		}

    // if(distance < 43){
		// 	if(_y<0){
		// 		if((-45)<corner && corner<45){
		// 			this.sendData('AQ==')
		// 		}else if(_x>0){
		// 			this.sendData('Bw==')
		// 		} else {
		// 			this.sendData('Aw==')
		// 		}
		// 	}else {
		// 		if((-45)<corner && corner<45){
		// 			this.sendData('BQ==')
		// 		}else if(_x>0){
		// 			this.sendData('Bw==')
		// 		} else {
		// 			this.sendData('Aw==')
		// 		}
		// 	}
    // } else{
    //   if(_y<0){
    //     if((-45)<corner && corner<45){
    //         this.sendData('Ag==')
    //     }else if(_x>0){
    //         this.sendData('CA==')
    //     } else {
    //         this.sendData('BA==')
    //     }
    //   } else {
    //     if((-45)<corner && corner<45){
    //         this.sendData('Bg==')
    //     }else if(_x>0){
    //         this.sendData('CA==')
    //     } else {
    //         this.sendData('BA==')
    //     }
    //   }
    // }
  }

  _onPanResponderGrant(event, gestureState){
		const {identifier} = event.nativeEvent
		const {touches} = event.nativeEvent
		this.setState({x: touches[0].pageX, y: touches[0].pageY })
		this.setState({centerX: touches[0].pageX, centerY: touches[0].pageY })
		if(identifier != 0){
			position.setValue({x: 0, y: 0})
		}
  }

  _onPanResponderMove(event, gestureState){
		const {position, x,y} = this.state
		const {touches, identifier} = event.nativeEvent
			this._position((touches[0].pageX-x),(touches[0].pageY-y))
		//this._position(gestureState.dx, gestureState.dy)
		// if((-60)<=position.x._value && position.x._value<=60){
		// if((-60)<=position.x._value&& position.x._value<=(60)&& position.y._value<(0)){
		//   this.sendData('AQ==')
		// }
		// if((-60)<=position.x._value&& position.x._value<=(60)&& position.y._value>(0)){
		//   this.sendData('Aw==')
		// }
		// if((-60)<position.y._value&& position.y._value<(60)&& position.x._value>(0)){
		//   this.sendData('BA==')
		// }
		// if((-60)<position.y._value&& position.y._value<(60)&& position.x._value<(0)){
		//   this.sendData('Ag==')
		// }
		//console.log(event.touchHistory)
  }

  _onPanResponderRelease(event, gestureState){
		const {position} = this.state
		const {touches} = event.nativeEvent
		this.sendData('BQ==')
		// position.setValue(this.state.x,this.state.y)
		position.setValue(gestureState.stateID)
  }

  render(){
		return(
			<View style ={{marginTop: 90, marginLeft: 50,}}>
				<Image source = {JoyStick_Background}
								style ={{alignItems:'center',justifyContent:'center'}}      
				>
					<View {...this.panResponder.panHandlers}>
							<Animated.Image source = {JoyStick_Thumb}
															style = {[this.state.position.getLayout(), styles.jumstickThumb]}
							/>  
					</View>
				</Image>
			</View>
		)
  }
}

JoyStick.propType = {
  info: React.PropTypes.array
}

const styles = StyleSheet.create({
  jumstickThumb: {
    width: 100,
    height: 100
  }
})