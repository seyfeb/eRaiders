// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs'
import rentalStackNav from './rentalStackNavigation';

import { TabNavigator } from 'react-navigation';


class BoardRentalScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
}

class BoardUnlockScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }
}

class BoardInfoScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }
}




// const tabNav = TabNavigator({
//     TabItem1: {
//         screen: stackNav,
//         navigationOptions: {
//             tabBarLabel:"Tab 1",
//             tabBarIcon: ({ tintColor }) => <Icon name={"glass"} size={30} color={tintColor} />
//         }
//     }

//     ///... add more tabs here

// }, {
//         tabBarOptions: {
//             activeTintColor: '#222',
//         }
// });








export default TabNavigator({
  Rental: { screen: rentalStackNav},//,
        // navigationOptions: {
            // tabBarLabel:"Booking",
             // },
  Unlock: { screen: BoardUnlockScreen },
  Info: { screen: BoardInfoScreen },
}
// , {
//         tabBarOptions: {
//             activeTintColor: '#222',
//         }
// }
);
