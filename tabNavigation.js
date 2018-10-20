import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs'

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

export default TabNavigator({
  Rental: { screen: BoardRentalScreen },
  Unlock: { screen: BoardUnlockScreen },
  Info: { screen: BoardInfoScreen },
});