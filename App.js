// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */

import React, {Component} from 'react';
import {ActivityIndicator, FlatList, Platform, StyleSheet, Text, View, Button} from 'react-native';
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
  constructor(props) {
    super(props);
    this.state = { dataSource: '', isLoading: true };
  }

  componentDidMount(){
    return fetch('http://10.0.25.125:3000/api/boards/geo/49.4543640/11.0512897')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.boards,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  unlockBoard()
  {

  }

  highlightBoard()
  {
    // Change LED color
  }



  render(){

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={{flex: 1, paddingTop:20}}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <View style={{flexWrap: 'wrap', alignItems: 'flex-start',flexDirection:'row'}}>
            <Text style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>{item.id} {item.state} {item.costPerHour}</Text>
            <View style={{width:100, margin: 5}}><Button onPress={() => this.highlightBoard() } title="Highlight"/></View>
            <View style={{width:80, margin: 5}}><Button onPress={() => this.unlockBoard() } title="Unlock"/></View>
            </View>}
          keyExtractor={({id}, index) => id}
        />
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




const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  available: {
    color: 'green'
  },
  busy: {
    color: 'red'
  }
});
