import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class JoyStickBtn extends React.Component {
    constructor(props) {
        super(props)
        let btnStyle = styles.circle
        let txtStyle = styles.textInCircle
        if (props.type && props.type == 'rect') {
            btnStyle = styles.rectangle
            txtStyle = styles.textInRect
        }
        this.state = {
            pressStyle: styles.circleRelease,
            btnStyle: btnStyle,
            txtStyle: txtStyle,
            text: this.props.text
        }
        this.handleOnPress = this.handleOnPress.bind(this)
        this.handleOnTouchStart = this.handleOnTouchStart.bind(this)
        this.handleOnTouchEnd = this.handleOnTouchEnd.bind(this)
    }
    render() {
        return (
            <View onTouchStart={this.handleOnTouchStart} onTouchEnd={this.handleOnTouchEnd} style={this.props.style}>
                <View style={[this.state.btnStyle, this.state.pressStyle]}>
                    <Text style={this.state.txtStyle}>{this.props.children || this.state.text}</Text>
                </View>
            </View>
        )
    }
    handleOnPress() {
        if (this.props.onPress) {
            let text = this.state.text
            this.props.onPress(text)
            if (this.props.text && this.props.text == text && this.props.revert) {
                this.setState({
                    text: this.props.revert
                })
            } else if (this.props.revert && this.props.revert == text) {
                this.setState({
                    text: this.props.text
                })
            }
        }
    }
    handleOnTouchStart() {
        this.setState({
            pressStyle: styles.circlePress
        })
        this.handleOnPress()
    }
    handleOnTouchEnd() {
        this.setState({
            pressStyle: styles.circleRelease
        })
    }

}

const styles = StyleSheet.create({
    circle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rectangle: {
        borderRadius: 5,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 50,
    },
    circleRelease: {
        backgroundColor: 'mediumseagreen',
    },
    circlePress: {
        backgroundColor: 'gray',
    },
    textInRect: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white'
    },
    textInCircle: {
        fontSize: 35,
        fontWeight: 'bold',
        color: 'white'
    }
})