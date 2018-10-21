import React, { Component } from 'react';
import { Button, DatePickerAndroid, TimePickerAndroid, StyleSheet, TouchableOpacity, Text, TextInput, View } from 'react-native';
import { StackNavigator} from 'react-navigation'


import Mapbox from '@mapbox/react-native-mapbox-gl';
import Moment from 'react-moment';
Mapbox.setAccessToken('pk.eyJ1Ijoic2V5ZmViIiwiYSI6ImNqbmg2bmd0dDA3YmUzcHI3ZDA4OW9vb3gifQ.nvQYS5L65MsINHCwMFmDsQ');

// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const geocodingClient = mbxGeocoding({ accessToken: 'pk.eyJ1Ijoic2V5ZmViIiwiYSI6ImNqbmg2bmd0dDA3YmUzcHI3ZDA4OW9vb3gifQ.nvQYS5L65MsINHCwMFmDsQ' });

import bleConnector from './bleConnection';

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
        
        tmpHour = this.state.hour + '';
        paddedHour = tmpHour.length >= 2 ? tmpHour : new Array(2 - tmpHour.length + 1).join(0) + tmpHour;

        tmpMinutes = this.state.minute + '';
        paddedMinutes = tmpMinutes.length >= 2 ? tmpMinutes : new Array(2 - tmpMinutes.length + 1).join(0) + tmpMinutes;

        tmpHour = this.state.durationHour + '';
        paddedDurationHour = tmpHour.length >= 2 ? tmpHour : new Array(2 - tmpHour.length + 1).join(0) + tmpHour;

        tmpMinutes = this.state.durationMinute + '';
        paddedDurationMinutes = tmpMinutes.length >= 2 ? tmpMinutes : new Array(2 - tmpMinutes.length + 1).join(0) + tmpMinutes;

    return (
      <View style={styles.container}>
        {/*<Mapbox.MapView
            styleURL={Mapbox.StyleURL.Street}
            zoomLevel={15}
            centerCoordinate={[11.256, 43.770]}
            style={styles.container}>
        </Mapbox.MapView>*/}
        {/*<View style={styles.buttons}>
        <Button onPress={() => this.openAndroidDatePicker() } title="Select date"/></View>*/}
        <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center', marginTop:10, marginBottom:10}}>Select pick-up date</Text>
        <Text style={styles.label}
        onPress={() => this.openAndroidDatePicker()}>{this.state.year}-{this.state.month}-{this.state.day}</Text>

        {/*<View style={styles.buttons}>
        <Button onPress={() => this.openAndroidTimePicker() } title="Select time"/></View>*/}
        <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center', marginTop:10, marginBottom:10}}>Select pick-up time</Text>
        <Text style={styles.label}
        onPress={() => this.openAndroidTimePicker()}>{paddedHour}:{paddedHour}</Text>

        {/*<View style={styles.buttons}>
        <Button onPress={() => this.openAndroidTimePickerForDuration() } title="Expected rental duration"/></View>*/}
        <Text style={{fontSize:20, fontWeight:'bold', textAlign:'center', marginTop:10, marginBottom:10}}>Expected rental duration</Text>
        <Text style={styles.label}
        onPress={() => this.openAndroidTimePickerForDuration()}>{paddedDurationHour}:{paddedDurationMinutes}</Text>

        <View style={styles.buttons}>
        <Button onPress={() => this.props.navigation.navigate('Overview', this.state)} title="Next"/></View>
      </View>
    );
  }
}

class PickupLocationSelectionScreen extends React.Component {
    constructor(props) {
        super(props);
        {/* mapCenter:[11.256, 43.770]*/}
        this.state = { text: '', mapCenter:[11.0036450, 49.5981187], mapStyle: Mapbox.StyleURL.Street, bookButtonVisible:true };
    }

    renderAnnotations () {
      return (

        <View>
        <Mapbox.PointAnnotation
          key='pointAnnotation0'
          id='pointAnnotation0'
          coordinate={[11.0036450, 49.5981187]}>

          <View>
            <View />
          </View>
          {/*<Mapbox.Callout title='Look! An annotation!' />*/}
        </Mapbox.PointAnnotation>
        <Mapbox.PointAnnotation
          key='pointAnnotation1'
          id='pointAnnotation1'
          coordinate={[11.0512897, 49.4543640]}>

          <View>
            <View />
          </View>
          {/*<Mapbox.Callout title='Look! An annotation!' />*/}
        </Mapbox.PointAnnotation>
        <Mapbox.PointAnnotation
          key='pointAnnotation2'
          id='pointAnnotation2'
          coordinate={[11.05, 49.4543641]}
          onSelected= { () => console.warn('yes')}>

          <View style={styles.annotationContainer}>
            <View style={styles.annotationFill} />
          </View>
          <Mapbox.Callout title='70% battery' />
        </Mapbox.PointAnnotation>
        <Mapbox.PointAnnotation
          key='pointAnnotation3'
          id='pointAnnotation3'
          coordinate={[11.0515, 49.455]}
          onSelected= { () => this.setState({bookButtonVisible:true})}>

          <View style={styles.annotationContainer}>
            <View style={styles.annotationFill} />
          </View>
          <Mapbox.Callout title='80% battery' />
        </Mapbox.PointAnnotation>
        <Mapbox.PointAnnotation
          key='pointAnnotation4'
          id='pointAnnotation4'
          coordinate={[11.053, 49.4528]}
          onSelected= { () => this.setState({bookButtonVisible:true})}
          onDeselected= { () => this.setState({bookButtonVisible:false})}>

          <View style={styles.annotationContainer}>
            <View style={styles.annotationFill} />
          </View>
          <Mapbox.Callout title='60% battery' />
        </Mapbox.PointAnnotation>
        </View>
      )
    }
    updateLocation(location){
        this.setState({text: location, mapCenter: [11.0512897, 49.4543640], mapStyle: Mapbox.StyleURL.Street});

    }


  render() {

    bookingButtons = <View style={{position:'absolute', height:60, alignItems:'center',position: 'absolute', justifyContent:'center', bottom:40, width:'100%',flexWrap: 'wrap', alignItems: 'flex-start',flexDirection:'row'}}>
        <View style={{width:100, height:30, margin:15}}>
        <Button onPress={() => this.props.navigation.navigate('OverviewDirectBooking')} title="Book!"/>
        </View>
        <View style={{width:100, height:30, margin:15}}>
        <Button onPress={() => this.props.navigation.navigate('DateTime')} title="Call board!"/>
        </View>
        </View>;

    return (
      <View style={styles.container}>
        <Mapbox.MapView
            styleURL={this.state.mapStyle}
            zoomLevel={15}
            centerCoordinate={this.state.mapCenter}
            style={styles.container}>
            {this.renderAnnotations()}
        </Mapbox.MapView>
        <View style={{alignItems:'center',position: 'absolute', justifyContent:'center', top:20, width:'100%'}}>
        <TextInput
                style={{ height:80, padding:15, marginLeft:10, marginRight:10, marginBottom:40, width:'90%', height: 50, borderWidth: 1, backgroundColor: 'white', minWidth: 200, fontSize:18}}
                onChangeText={(text) => this.setState({text})}
                onEndEditing={(text) => this.updateLocation(text)}
                placeholder='Select your pickup location!'
                value={this.state.text}
            />
        </View>
        {this.state.bookButtonVisible?bookingButtons:<View></View>}
        


      </View>
    );

{/*
    return (
      <View style={styles.container}>

            <TextInput
                style={{height:80, padding:15,marginLeft:10, marginRight:10, marginBottom:40, marginTop:60, height: 50, borderWidth: 1, backgroundColor: 'white', minWidth: 200, fontSize:18}}
                onChangeText={(text) => this.setState({text})}
                placeholder='Select your pickup location!'
                value={this.state.text}
            />
        <Mapbox.MapView
            styleURL={Mapbox.StyleURL.Street}
            zoomLevel={15}
            centerCoordinate={[11.256, 43.770]}
            style={styles.container}>
        </Mapbox.MapView>

        <View style={styles.buttons}>
        <Button onPress={() => this.props.navigation.navigate('DateTime')} title="Next"/></View>
      </View>
    );
*/}
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

        tmpHour = this.state.hour + '';
        paddedHour = tmpHour.length >= 2 ? tmpHour : new Array(2 - tmpHour.length + 1).join(0) + tmpHour;

        tmpMinutes = this.state.minute + '';
        paddedMinutes = tmpMinutes.length >= 2 ? tmpMinutes : new Array(2 - tmpMinutes.length + 1).join(0) + tmpMinutes;

        tmpHour = this.state.durationHour + '';
        paddedDurationHour = tmpHour.length >= 2 ? tmpHour : new Array(2 - tmpHour.length + 1).join(0) + tmpHour;

        tmpMinutes = this.state.durationMinute + '';
        paddedDurationMinutes = tmpMinutes.length >= 2 ? tmpMinutes : new Array(2 - tmpMinutes.length + 1).join(0) + tmpMinutes;

    return (
      <View style={styles.container}>
        <Text style={{fontSize:20, height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>Rental date</Text>
        <Text style={{height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>{this.state.year}-{this.state.month}-{this.state.day}</Text>
        <Text style={{fontSize:20, height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>Rental time</Text>
        <Text style={{height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>{paddedHour}:{paddedMinutes}</Text>
        <Text style={{fontSize:20, height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>Expected rental duration</Text>
        <Text style={{height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>{paddedDurationHour}:{paddedDurationMinutes}</Text>
        <Text style={{fontSize:20, height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>Price per minute</Text>
        <Text style={{height: 80, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>0.10€/min.</Text>
        <Button onPress={() => this.props.navigation.navigate('Success', this.state)} title="Book board!"/>
      </View>
    );
  }
}

class DirectPickupOverviewScreen extends React.Component {
    constructor(props) {
        super(props);
        // this.state = { day: this.props.navigation.state.params.day };
        this.state = this.props.navigation.state.params;
    }


  render() {

//         let now = new Date();

//         let tmpHour = now.getHours();
//         // console.wa

//         paddedHour = tmpHour.length >= 2 ? tmpHour : new Array(2 - tmpHour.length + 1).join(0) + tmpHour;
// paddedHour = '9';
//         tmpMinutes = this.state.minute + '';
//         paddedMinutes = tmpMinutes.length >= 2 ? tmpMinutes : new Array(2 - tmpMinutes.length + 1).join(0) + tmpMinutes;

//         tmpHour = this.state.durationHour + '';
//         paddedDurationHour = tmpHour.length >= 2 ? tmpHour : new Array(2 - tmpHour.length + 1).join(0) + tmpHour;

//         tmpMinutes = this.state.durationMinute + '';
//         paddedDurationMinutes = tmpMinutes.length >= 2 ? tmpMinutes : new Array(2 - tmpMinutes.length + 1).join(0) + tmpMinutes;

  paddedMinutes = '25';
  paddedHour = '14';
    return (
      <View style={styles.container}>
        <Text style={{fontSize:20, height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>Rental time</Text>
        <Text style={{height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>{paddedHour}:{paddedMinutes}</Text>
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


    
    // setInterval(() => {
    //     let remString = '';
    //     let now = new Date();
    //     // this.state.year+'-'+this.state.month+'-'+this.state.day+'T'+this.state.hour+':'+this.state.minute+':00'
    //     let reservationDate = new Date();

    //     console.warn(this.state);
    //     reservationDate.setUTCFullYear(this.state.year);
    //     reservationDate.setUTCMonth(this.state.month-1);
    //     reservationDate.setUTCDate(this.state.day);
    //     reservationDate.setUTCHours(this.state.hour);
    //     reservationDate.setUTCMinutes(this.state.minute);
    //     // console.warn(now);
    //     console.warn(reservationDate);

    //     let dateDifference = reservationDate - now;

    //     if ( dateDifference <= 0 )
    //     {
    //         // remString = 'Board arrived. Have fun!';
    //     }
    //     else
    //     {
    //         // console.warn(now.toISOString());
    //         // console.warn(reservationDate.toISOString());

    //         // let remDays = Math.floor(dateDifference / (1000*60*60*24));
    //         // // let remMinutes = Math.floor(dateDifference / (1000*60))- remDays*(1000*60*60*24)- remHours*(1000*60*60);
    //         // // let remSeconds = Math.floor(dateDifference / 1000)- remDays*(1000*60*60*24)- remHours*(1000*60*60)- remMinutes*(1000*60);
    //         // let remDays = Math.floor(dateDifference / (1000*60*60*24));
    //         // let remHours = Math.floor(dateDifference / (1000*60*60)) - remDays*(1000*60*60);
    //         // // let remHours = Math.floor(dateDifference / (1000*60*60));
    //         // let remMinutes = Math.floor(dateDifference / (1000*60));
    //         // let remSeconds = Math.floor(dateDifference / 1000);


    //         // if (remDays > 0) {
    //         //     remString = remDays + 'd ' + remHours + 'h';
    //         //     console.warn('a');
    //         // }
    //         // else 
    //         // {
    //         //     if (remHours > 0) {
    //         //         remString = remHours + 'h ' + remMinutes + 'min';
    //         //     console.warn('b');
    //         //     }
    //         //     else
    //         //     {
    //         //         if (remMinutes > 0) {
    //         //             remString = remMinutes + 'min ';
    //         //     console.warn('c');
    //         //         }
    //         //         else
    //         //         {
    //         //             remString = 'Board arrived. Have fun!';
    //         //     console.warn('d');
    //         //         }
    //         //     }
    //         // }

    //         // console.warn('days'+remDays+'h'+remHours+'min'+remMinutes);
    //     }

    //       this.setState(() => {
    //         return { remainingTime: remString };
    //       });
    //     }, 2000);
    }




  render() {
    return (
      <View style={styles.container}>
        <Text style={{height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>Your board has successfully been reserved and will be waiting at the requested location.</Text>
        {/*<Text style={{height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>Your board arrives in</Text>
        <Text style={{textAlign:'center', height: 60, borderColor: 'gray', borderWidth: 0, fontSize: 40, fontWeight: 'bold'}}>{this.state.remainingTime}</Text>
        */}
      </View>
    );
  }
}


class SuccessDirectPickupScreen extends React.Component {
    constructor(props) {
        super(props);
        // this.state = { day: this.props.navigation.state.params.day };
        this.state = this.props.navigation.state.params;
        // console.warn(this.state)
        this.state.remainingTime = '0';


    
    // setInterval(() => {
    //     let remString = '';
    //     let now = new Date();
    //     // this.state.year+'-'+this.state.month+'-'+this.state.day+'T'+this.state.hour+':'+this.state.minute+':00'
    //     let reservationDate = new Date();

    //     console.warn(this.state);
    //     reservationDate.setUTCFullYear(this.state.year);
    //     reservationDate.setUTCMonth(this.state.month-1);
    //     reservationDate.setUTCDate(this.state.day);
    //     reservationDate.setUTCHours(this.state.hour);
    //     reservationDate.setUTCMinutes(this.state.minute);
    //     // console.warn(now);
    //     console.warn(reservationDate);

    //     let dateDifference = reservationDate - now;

    //     if ( dateDifference <= 0 )
    //     {
    //         // remString = 'Board arrived. Have fun!';
    //     }
    //     else
    //     {
    //         // console.warn(now.toISOString());
    //         // console.warn(reservationDate.toISOString());

    //         // let remDays = Math.floor(dateDifference / (1000*60*60*24));
    //         // // let remMinutes = Math.floor(dateDifference / (1000*60))- remDays*(1000*60*60*24)- remHours*(1000*60*60);
    //         // // let remSeconds = Math.floor(dateDifference / 1000)- remDays*(1000*60*60*24)- remHours*(1000*60*60)- remMinutes*(1000*60);
    //         // let remDays = Math.floor(dateDifference / (1000*60*60*24));
    //         // let remHours = Math.floor(dateDifference / (1000*60*60)) - remDays*(1000*60*60);
    //         // // let remHours = Math.floor(dateDifference / (1000*60*60));
    //         // let remMinutes = Math.floor(dateDifference / (1000*60));
    //         // let remSeconds = Math.floor(dateDifference / 1000);


    //         // if (remDays > 0) {
    //         //     remString = remDays + 'd ' + remHours + 'h';
    //         //     console.warn('a');
    //         // }
    //         // else 
    //         // {
    //         //     if (remHours > 0) {
    //         //         remString = remHours + 'h ' + remMinutes + 'min';
    //         //     console.warn('b');
    //         //     }
    //         //     else
    //         //     {
    //         //         if (remMinutes > 0) {
    //         //             remString = remMinutes + 'min ';
    //         //     console.warn('c');
    //         //         }
    //         //         else
    //         //         {
    //         //             remString = 'Board arrived. Have fun!';
    //         //     console.warn('d');
    //         //         }
    //         //     }
    //         // }

    //         // console.warn('days'+remDays+'h'+remHours+'min'+remMinutes);
    //     }

    //       this.setState(() => {
    //         return { remainingTime: remString };
    //       });
    //     }, 2000);
    }




  render() {
    return (
      <View style={styles.container}>
        <Text style={{height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>Your board has successfully been reserved and will be waiting at the requested location.</Text>
        {/*<Text style={{height: 40, borderColor: 'gray', borderWidth: 0, fontWeight: 'bold'}}>Your board arrives in</Text>
        <Text style={{textAlign:'center', height: 60, borderColor: 'gray', borderWidth: 0, fontSize: 40, fontWeight: 'bold'}}>{this.state.remainingTime}</Text>
        */}
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
    OverviewDirectBooking: {
        screen: DirectPickupOverviewScreen,
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
    Success: {
        screen: SuccessDirectPickupScreen,
        navigationOptions: ({ navigation }) => ({
          title: "Success",
        }),
    },

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
  },
  annotationFill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'orange',
    transform: [{ scale: 0.6 }],
  },
  label: {
    height: 40, 
    fontSize: 40,
    borderColor: 'white', 
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