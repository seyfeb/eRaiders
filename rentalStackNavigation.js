import React, { Component } from 'react';
import { Button, DatePickerAndroid, TimePickerAndroid, StyleSheet, TouchableOpacity, Text, TextInput, View } from 'react-native';
import { StackNavigator} from 'react-navigation'

import Mapbox from '@mapbox/react-native-mapbox-gl';
Mapbox.setAccessToken('pk.eyJ1Ijoic2V5ZmViIiwiYSI6ImNqbmg2bmd0dDA3YmUzcHI3ZDA4OW9vb3gifQ.nvQYS5L65MsINHCwMFmDsQ');


class PickupDateTimeSelectionScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: '', year:'2018', month:'10', day:'21', hour:'18', minute:'00' };
    }

    async openAndroidDatePicker() {
      try {
        const {action, year, month, day} = await DatePickerAndroid.open({
          date: new Date()
        });
        this.setState(previousState => {
            return { year: year, month: month, day: day };
        });
      } catch ({code, message}) {
        console.warn('Cannot open date picker', message);
      }
    }

    async openAndroidTimePicker() {
        try {
          const {action, hour, minute} = await TimePickerAndroid.open({
            hour: 14,
            minute: 0,
            is24Hour: true, // Will display '2 PM'
          });        
            this.setState(previousState => {
                return { hour: hour, minute: minute };
            });
          if (action !== TimePickerAndroid.dismissedAction) {
          }
        } catch ({code, message}) {
          console.warn('Cannot open time picker', message);
      }
    }



  render() {
    return (
      <View style={styles.container}>
          <Text style={{height: 40, borderColor: 'gray', borderWidth: 0}}>Select your arrival date & time!</Text>
            <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: 'white', minWidth: 200}}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
            />
        {/*<Mapbox.MapView
            styleURL={Mapbox.StyleURL.Street}
            zoomLevel={15}
            centerCoordinate={[11.256, 43.770]}
            style={styles.container}>
        </Mapbox.MapView>*/}
        <Button onPress={() => this.openAndroidDatePicker() } title="Select date"/>
        <Text style={{height: 40, borderColor: 'gray', borderWidth: 0}}>{this.state.year}-{this.state.month}-{this.state.day}</Text>

        <Button onPress={() => this.openAndroidTimePicker() } title="Select time"/>
        <Text style={[styles.labels, { height: 40, borderColor: 'gray', borderWidth: 0}]}>{this.state.hour}:{this.state.minute}</Text>

        <Text style={{height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>Expected rental duration</Text>
         <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: 'white', minWidth: 200}}
                onChangeText={(duration) => this.setState({duration})}
                value={this.state.duration}
            />

        <Button onPress={(day) => this.props.navigation.navigate('OverviewScreen', {day: day})} title="Next"/>
      </View>
    );


    {/*
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{height: 40, borderColor: 'gray', borderWidth: 0}}>Select your pick-up location!</Text>
        <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: 'white', minWidth: 200}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
        />
        <Mapbox.MapView
            styleURL={Mapbox.StyleURL.Street}
            zoomLevel={15}
            centerCoordinate={[11.256, 43.770]}
            style={styles.container}>
        </Mapbox.MapView>
      </View>
    );*/}
  }
}

class PickupLocationSelectionScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: '' };
    }


  render() {
    return (
      <View style={styles.container}>
          <Text style={{height: 40, borderColor: 'gray', borderWidth: 0}}>Select your pick-up location!</Text>
            <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: 'white', minWidth: 200}}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
            />
        {/*<Mapbox.MapView
            styleURL={Mapbox.StyleURL.Street}
            zoomLevel={15}
            centerCoordinate={[11.256, 43.770]}
            style={styles.container}>
        </Mapbox.MapView>*/}
        <Button onPress={() => this.props.navigation.navigate('DateTime')} title="Next"/>
      </View>
    );

    {/*
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{height: 40, borderColor: 'gray', borderWidth: 0}}>Select your pick-up location!</Text>
        <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: 'white', minWidth: 200}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
        />
        <Mapbox.MapView
            styleURL={Mapbox.StyleURL.Street}
            zoomLevel={15}
            centerCoordinate={[11.256, 43.770]}
            style={styles.container}>
        </Mapbox.MapView>
      </View>
    );*/}
  }
}
class PickupOverviewScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { da: '' };
    }


  render() {
    return (
      <View style={styles.container}>
          <Text style={{height: 40, borderColor: 'gray', borderWidth: 0}}>{this.props.day}
{this.props.navigation.state.day}
{this.props.navigation.state.params.day}</Text>
        <Button onPress={() => this.props.navigation.navigate('DateTime')} title="Book board!"/>
      </View>
    );
  }
}



const rentalStackNav = StackNavigator({
    Location: {
        // `ProfileScreen` is a React component that will be the main content of the screen.
        screen: PickupLocationSelectionScreen,
        // When `ProfileScreen` is loaded by the StackNavigator, it will be given a `navigation` prop.

      
        // Optional: Override the `navigationOptions` for the screen
        navigationOptions: ({ navigation }) => ({
          title: "Pick-up location",
        }),
    },
    DateTime: {
        // `ProfileScreen` is a React component that will be the main content of the screen.
        screen: PickupDateTimeSelectionScreen,
        navigationOptions: ({ navigation }) => ({
          title: "Select date & time",
        }),
    },
    Overview: {
        screen: PickupOverviewScreen,
        navigationOptions: ({ navigation }) => ({
          title: "Checkout",
        }),
    },

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    textAlign: 'center'
  }
});

export default rentalStackNav;