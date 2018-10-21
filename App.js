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
import {Overlay} from 'react-native-elements';

// import Icon from 'react-native-vector-icons/FontAwesome'
import Icon from 'react-native-vector-icons/Ionicons';


import bleConnector from './bleConnection';

import { TabNavigator } from 'react-navigation';


const batteryIcon = (<Icon name="ios-battery-charging" size={30} color="#900" />)


class BoardRentalScreen extends React.Component {
  constructor(props)
  {
    super(props);
  }


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

  async componentDidMount(){
    // await bleConnector.scanAndConnect();
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
      bleConnector.writeBoardState("BQ==");
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
            <Text style={{flex: 1, justifyContent: 'center', alignItems: 'center', fontWeight:'bold', fontSize:16}}>{item.id} {item.state}   {item.costPerHour}€/h</Text>
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
  constructor(props) {
    super(props);
    this.state = { showWindow: false, returnSuccess: false, boardRented:true};
  }

  sendBoardHome(){
    bleConnector.writeBoardState("Bw==");
    this.setState({showWindow: false, returnSuccess: true});
  }

  render() {
    if(this.state.showWindow)
    {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{}}><Text style={{alignSelf:'flex-end'}}>Battery 80% </Text></View>
          <View style={{}}><Text style={{alignSelf:'flex-end'}}>Remaining distance: 16km </Text></View>
          <Text style={{fontSize:40, fontWeight:'bold', margin:20}}>20 km/h </Text>
          <View style={{position:'absolute', zIndex:2, border:2, width:300, height:500, top:40, backgroundColor:'white', padding:10, paddingTop:20}}>
            <Text style={{textAlign:'center', fontSize:25, marginBottom:20}}>Do you want to send your board to a home station?</Text>
            <View  style={styles.infoButton}> 
              <Button onPress={() => this.sendBoardHome()} title="Confirm"/>
            </View>
            <View style={styles.infoButton}>
              <Button onPress={() => this.setState({showWindow:false})} title="Cancel"/>
            </View>
          </View>

        </View>
      );
    }

    if(this.state.returnSuccess)
    {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{fontSize:35, textAlign:'center'}}>
            Board successfully returned!
            </Text>   
            <View style={[styles.infoButton,{width:40,marginTop:30}]}> 
              <Button onPress={() => this.setState({returnSuccess:false, showWindow:false, boardRented: false})} title="Ok"/>
            </View>
        </View>
      );
    }

    if(!this.state.boardRented)
    {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{fontSize:30, textAlign:'center'}}>
            You are currently not connected to a board!
            </Text>   
            <View style={[styles.infoButton,{marginTop:30}]}> 
              <Button onPress={() => this.setState({returnSuccess:false, showWindow:false, boardRented: false})} title="Search for a board!"/>
            </View>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{}}><Text style={{alignSelf:'flex-end'}}>Battery 80% </Text></View>
        <View style={{}}><Text style={{alignSelf:'flex-end'}}>Remaining distance: 16km </Text></View>
        <Text style={{fontSize:40, fontWeight:'bold', margin:20}}>20 km/h </Text>
        <View style={styles.infoButton}>
        <Button onPress={() => bleConnector.writeBoardState("BQ==")} title="Unlock board"/>
        </View>
        <View style={styles.infoButton}>
        <Button onPress={() => bleConnector.writeBoardState("Bg==")} title="Lock board"/>
        </View>
        <View style={styles.infoButton}>
        <Button onPress={() => this.setState({showWindow:true})} title="Lock & drive home"/>
        </View>
        <View style={styles.infoButton}>
        <Button onPress={() => bleConnector.writeBoardState("CA==")} title="Impress mode"/>
        </View>
        <View style={styles.infoButton}>
          <Button onPress={() => bleConnector.writeBoardState("CA==")} title="Go home!"/>
        </View>

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
  },
  infoButton:{
    margin:10
  }


});
