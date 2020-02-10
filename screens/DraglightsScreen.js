import React from 'react';
import { View, Text, Image, Button, Alert } from 'react-native';
import styles from './DraglightsScreen.style';
import { Accelerometer } from 'expo-sensors';
const imageStateOff = require('./../assets/draglights_Off.png');
const imageState1 = require('./../assets/draglights_0.png');
const imageState2 = require('./../assets/draglights_1.png');
const imageState3 = require('./../assets/draglights_2.png');
const imageState4 = require('./../assets/draglights_3.png');
const imageState5 = require('./../assets/draglights_4.png');
const imageState6 = require('./../assets/draglights_5.png');

const Value = ({ name, value }) => (
  <View style={styles.valueContainer}>
    <Text style={styles.valueName}>{name}:</Text>
    <Text style={styles.valueValue}>{new String(value).substr(0, 8)}</Text>
  </View>
)

class DraglightsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      z: 0,
      _x: 0,
      _y: 0,
      _z: 0,
      draglightStateInterval: false,
      currentState: -1,
      greenLightTime: false
    };
  }

  componentDidMount() {
    Accelerometer.setUpdateInterval(20);
    Accelerometer.addListener(accelerometerData => {
      //if has position set
      if (this.state._x !== 0 && this.state._y !== 0 && this.state._z !== 0) {
        let sensibility = 0.3
        //if has position position variation
        if ((Math.abs(accelerometerData.x) - Math.abs(this.state._x) > sensibility) ||
          (Math.abs(accelerometerData.y) - Math.abs(this.state._y) > sensibility) ||
          (Math.abs(accelerometerData.z) - Math.abs(this.state._z) > sensibility)) {
          if (this.state.currentState >= 0) {
            //get movment position time
            this.finishIt(new Date())
          }
        }
      }
      this.setState({
        x: accelerometerData.x - this.state._x,
        y: accelerometerData.y - this.state._y,
        z: accelerometerData.z - this.state._z
      })
    });
  }

  getCurrentImage() {
    let image = '';
    switch (this.state.currentState) {
      case -1: image = imageStateOff; break;
      case 0: image = imageState1; break;
      case 1: image = imageState2; break;
      case 2: image = imageState3; break;
      case 3: image = imageState4; break;
      case 4: image = imageState5; break;
      case 5: image = imageState6; break;
      default: image = imageStateOff; break;
    }
    return image;
  }

  finishIt(time) {
    time = Math.abs(this.state.greenLightTime - time) / 1000 + 'ms';
    if (!this.state.greenLightTime) {
      this.setState(({ currentState: 5 }), () => {
        setTimeout(() => {
          this.setState(({
            currentState: -1,
            _x: 0,
            _y: 0,
            _z: 0,
            greenLightTime: false
          }))
          clearInterval(this.state.draglightStateInterval);
        }, 2000)
      })
    } else {
      Alert.alert(
        'Tempo de reação',
        time,
        [{
          text: 'OK', onPress: () => {
            this.setState(({
              currentState: -1,
              _x: 0,
              _y: 0,
              _z: 0,
              greenLightTime: false
            }))
            clearInterval(this.state.draglightStateInterval);
          }
        }],
        { cancelable: false },
      );
    }
  }

  readyToStart() {
    this.setState(previousState => ({
      currentState: previousState.currentState + 1
    }), () => {
      this.setDeviceCurrentPosition().then(() => {
        this.launchDraglight();
      })
    })
  }

  setDeviceCurrentPosition() {
    return new Promise(resolve => {
      //wait 500ms for avoid vibration by user touching button
      setTimeout(() => {
        this.setState(previousState => ({
          _x: previousState.x,
          _y: previousState.y,
          _z: previousState.z,
        }))
        resolve()
      }, 500)
    })
  }

  launchDraglight() {
    setTimeout(() => {
      this.setState({
        draglightStateInterval: this.draglightInterval()
      })
    }, 2000) //Time to launch draglight in ms
  }

  draglightInterval() {
    return setInterval(() => (
      this.setState(previousState => ({
        currentState: previousState.currentState < 4 ? previousState.currentState + 1 : previousState.currentState,
        greenLightTime: (previousState.currentState == 2) ? new Date() : previousState.greenLightTime
      }))
    ), 300) //Time between each draglight state in ms
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={this.getCurrentImage()}
          style={styles.draglights} />
        <Value name="x" value={this.state.x} />
        <Value name="y" value={this.state.y} />
        <Value name="z" value={this.state.z} />
        <Button title="I'm ready" onPress={() => this.readyToStart()} />
      </View>
    );
  }
}

exports.DraglightsScreen = DraglightsScreen;