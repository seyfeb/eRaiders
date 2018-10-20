import React, { Component } from 'react';
import { Button, DatePickerAndroid, TimePickerAndroid, StyleSheet, TouchableOpacity, Text, TextInput, View } from 'react-native';
import { StackNavigator} from 'react-navigation'


import Mapbox from '@mapbox/react-native-mapbox-gl';
Mapbox.setAccessToken('pk.eyJ1Ijoic2V5ZmViIiwiYSI6ImNqbmg2bmd0dDA3YmUzcHI3ZDA4OW9vb3gifQ.nvQYS5L65MsINHCwMFmDsQ');


class PickupDateTimeSelectionScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: '', year:'2018', month:'10', day:'21', hour:'18', minute:'00', durationHour:0, durationMinute:0 };
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

    async openAndroidTimePickerForDuration() {
        try {
          const {action, hour, minute} = await TimePickerAndroid.open({
            hour: 0,
            minute: 0,
            is24Hour: true, // Will display '2 PM'
          });        
            this.setState(previousState => {
                return { durationHour: hour, durationMinute: minute };
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
        {/*<Mapbox.MapView
            styleURL={Mapbox.StyleURL.Street}
            zoomLevel={15}
            centerCoordinate={[11.256, 43.770]}
            style={styles.container}>
        </Mapbox.MapView>*/}
        <View style={styles.buttons}>
        <Button onPress={() => this.openAndroidDatePicker() } title="Select date"/></View>
        <Text style={styles.label}>{this.state.year}-{this.state.month}-{this.state.day}</Text>

        <View style={styles.buttons}>
        <Button onPress={() => this.openAndroidTimePicker() } title="Select time"/></View>
        <Text style={styles.label}>{this.state.hour}:{this.state.minute}</Text>

        <View style={styles.buttons}>
        <Button onPress={() => this.openAndroidTimePickerForDuration() } title="Expected rental duration"/></View>
        <Text style={styles.label}>{this.state.durationHour}:{this.state.durationMinute}</Text>

        <View style={styles.buttons}>
        <Button onPress={() => this.props.navigation.navigate('Overview', this.state)} title="Next"/></View>
      </View>
    );
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

            <TextInput
                style={{height:80, padding:15,marginLeft:10, marginRight:10, marginBottom:40, marginTop:60, height: 50, border: 'none', borderColor: 'none', borderWidth: 1, backgroundColor: 'white', minWidth: 200, fontSize:18}}
                onChangeText={(text) => this.setState({text})}
                placeholder='Select your pickup location!'
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
        // this.state = { day: this.props.navigation.state.params.day };
        this.state = this.props.navigation.state.params;
    }


  render() {
    return (
      <View style={styles.container}>
        <Text style={{fontSize:20, height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>Rental date</Text>
        <Text style={{height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>{this.state.year}-{this.state.month}-{this.state.day}</Text>
        <Text style={{fontSize:20, height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>Rental time</Text>
        <Text style={{height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>{this.state.hour}:{this.state.minute}</Text>
        <Text style={{fontSize:20, height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>Expected rental duration</Text>
        <Text style={{height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>{this.state.durationHour}:{this.state.durationMinute}</Text>
        <Text style={{fontSize:20, height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>Price per minute</Text>
        <Text style={{height: 80, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>0.10€/min.</Text>
        <Button onPress={() => this.props.navigation.navigate('Success', this.state)} title="Book board!"/>
      </View>
    );
  }
}
class SuccessScreen extends React.Component {
    constructor(props) {
        super(props);
        // this.state = { day: this.props.navigation.state.params.day };
        this.state = this.props.navigation.state.params;
        // console.warn(this.state)
        this.state.remainingTime = '0';


    
    setInterval(() => {
        let remString = '';
        let now = new Date();
        // this.state.year+'-'+this.state.month+'-'+this.state.day+'T'+this.state.hour+':'+this.state.minute+':00'
        let reservationDate = new Date();

        console.warn(this.state);
        reservationDate.setUTCFullYear(this.state.year);
        reservationDate.setUTCMonth(this.state.month-1);
        reservationDate.setUTCDate(this.state.day);
        reservationDate.setUTCHours(this.state.hour);
        reservationDate.setUTCMinutes(this.state.minute);
        // console.warn(now);
        console.warn(reservationDate);

        let dateDifference = reservationDate - now;

        if ( dateDifference <= 0 )
        {
            remString = 'Board arrived. Have fun!';
        }
        else
        {
            // console.warn(now.toISOString());
            // console.warn(reservationDate.toISOString());

            let remDays = Math.floor(dateDifference / (1000*60*60*24));
            // // let remMinutes = Math.floor(dateDifference / (1000*60))- remDays*(1000*60*60*24)- remHours*(1000*60*60);
            // // let remSeconds = Math.floor(dateDifference / 1000)- remDays*(1000*60*60*24)- remHours*(1000*60*60)- remMinutes*(1000*60);
            // let remDays = Math.floor(dateDifference / (1000*60*60*24));
            let remHours = Math.floor(dateDifference / (1000*60*60)) - remDays*(1000*60*60);
            // // let remHours = Math.floor(dateDifference / (1000*60*60));
            // let remMinutes = Math.floor(dateDifference / (1000*60));
            // let remSeconds = Math.floor(dateDifference / 1000);


            if (remDays > 0) {
                remString = remDays + 'd ' + remHours + 'h';
                console.warn('a');
            }
            else 
            {
                if (remHours > 0) {
                    remString = remHours + 'h ' + remMinutes + 'min';
                console.warn('b');
                }
                else
                {
                    if (remMinutes > 0) {
                        remString = remMinutes + 'min ';
                console.warn('c');
                    }
                    else
                    {
                        remString = 'Board arrived. Have fun!';
                console.warn('d');
                    }
                }
            }

            // console.warn('days'+remDays+'h'+remHours+'min'+remMinutes);
        }

          this.setState(() => {
            return { remainingTime: remString };
          });
        }, 2000);
    }




  render() {
    return (
      <View style={styles.container}>
        <Text style={{height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>Your board has successfully been reserved and will be waiting at the requested location.</Text>
        <Text style={{height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>Your board arrives in</Text>
        <Text style={{textAlign:'center', height: 60, borderColor: 'gray', borderWidth: 0, fontSize: 40, fontWeight: 'bold'}}>{this.state.remainingTime}</Text>
        
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
    Success: {
        screen: SuccessScreen,
        navigationOptions: ({ navigation }) => ({
          title: "Success",
        }),
    },

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 0,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 10,
  },
  buttons: {
    marginLeft: 15,
    marginRight: 15,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center'

  }
});

export default rentalStackNav;