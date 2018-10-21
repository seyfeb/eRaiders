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


const batteryIcon = (<Icon name="ios-battery-charging" size={30} color="#900" />);
const userID = '1';

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
    this.state = { dataSource: '', isLoading: true, showRentalWindow: false, boardID:'1',
      selectedBoard:{price:undefined,id:undefined} };
  }

  async componentDidMount(){
    await bleConnector.scanAndConnect();
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


  highlightBoard()
  {
    // Change LED color
    console.warn('Highlighting board');
    bleConnector.writeBoardState("CQ==");

  }

  rentBoard(){
    this.setState({showRentalWindow:false})

    fetch('http://10.0.25.125:3000/api/boards/rental/rent/'+this.state.selectedBoard.id+'/'+userID,{method:'POST'})
    .then((response) => response.json())
    .then((responseJson) => {
      // TODO: Check response

    })
    .catch((error) =>{
      console.error(error);
    });
      

    //Unlock
    // bleConnector.writeBoardState("BQ==");

    // Go to board info page
    this.props.navigation.navigate('Info');
  }



  showRentalWindow(id, costPerHour){
    console.warn(id);
    this.setState({showRentalWindow:true,selectedBoard:{price:costPerHour,id:id}});
  }


  render(){

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      );
    }

    if (this.state.showRentalWindow){
      return(
        <View style={{flex: 1, paddingTop:20, alignItems: 'center'}}>
          <Text style={{fontSize:25,fontWeight:'bold', textAlign:'center',marginBottom:20}}>Rental information</Text>
          <Text style={{fontSize:20,fontWeight:'bold', textAlign:'center'}}>Price: {this.state.selectedBoard.price}€/h</Text>
          <Text style={{fontSize:20,fontWeight:'bold', textAlign:'center'}}>Battery: 80%</Text>
          <View style={{width:100, margin: 5,marginTop:80, selfAlign:'center',
                        textAlign: 'center',
                        alignItems: 'center',
                        justifyContent: 'center'}}>
            <Button style={{alignSelf:'center'}} onPress={() => this.rentBoard() } title="Rent this board!"/>
            <View style={{alignSelf:'center', marginTop:20}}>
              <Button style={{alignSelf:'center', marginTop:20}} onPress={() => this.setState({showRentalWindow: false}) } title="Cancel"/>
            </View>
          </View>

        </View>
      );
    }

    return(
      <View style={{flex: 1, paddingTop:20}}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => <View style={{flexWrap: 'wrap', alignItems: 'flex-start',flexDirection:'row'}}>
            <Text style={{flex: 1, justifyContent: 'center', alignItems: 'center', fontWeight:'bold', fontSize:16}}>{item.backendID} {item.state}   {item.costPerHour}€/h</Text>
            
            {
              item.state=='free' 
              && (<View>
                <View style={{width:100, margin: 5}}><Button onPress={() => this.highlightBoard() } title="Highlight"/></View>
                <View style={{width:80, margin: 5}}><Button onPress={() =>  this.showRentalWindow(item.id,item.costPerHour)} title="Rent"/></View>
                </View>
                )
            }
            {
              item.state=='rented' 
              && (
                <View>
                <View style={{width:100, margin: 5}}><Button color='#999999' disabled title="Highlight"/></View>
                <View style={{width:80, margin: 5}}><Button color='#999999' disabled title="Rent"/></View>
                </View>
                )
            }
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
    this.state = { showWindow: false, returnSuccess: false, boardRented:true, boardID:'1', boardBeingStolen:false, selectedBoard:{id:'0'}, pricePaid:undefined};




    // Regularly check if device is stolen
    // setInterval(() => {
    //   return fetch('http://10.0.25.125:3000/api/boards/info/'+this.state.boardID)
    //   .then((response) => response.json())
    //   .then((responseJson) => {

    //     if (responseJson.state == 'stolen')
    //     {

    //       this.setState({
    //         boardBeingStolen: true,
    //       }, function(){

    //       });
    //     }
    //     else
    //     {
    //       this.setState({
    //           boardBeingStolen: false,
    //         });
    //     }

    //   })
    //   .catch((error) =>{
    //     console.error(error);
    //   });
      
    // }, 2000);


  }

  sendBoardHome(){
    bleConnector.writeBoardState("Bw==");


    fetch('http://10.0.25.125:3000/api/boards/rental/return/'+this.state.selectedBoard.id+'/'+userID,{method:'POST'})
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({pricePaid:(responseJson.pricePaid).toFixed(2),showWindow: false, returnSuccess: true});

    })
    .catch((error) =>{
      console.error(error);
    });

  }

  render() {
    if(this.state.showWindow)
    {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{}}><Text style={{alignSelf:'flex-end'}}>Battery 80% </Text></View>
          <View style={{}}><Text style={{alignSelf:'flex-end'}}>Remaining distance: 16km </Text></View>
          <Text style={{fontSize:60, fontWeight:'bold', margin:20}}>20 km/h </Text>
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
            <Text style={{fontSize:20,marginTop:20,marginBottom:10}}>
              Total cost of your trip
            </Text>
            <Text style={{fontSize:30, fontWeight:'bold'}}>
              {this.state.pricePaid} €
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

    if (this.state.boardBeingStolen)
    {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{marginTop:20, fontSize:30, textAlign:'center', color:'red'}}>
            Your locked board is being moved! Please, check your board!
            </Text>   
        </View>
        );
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{}}><Text style={{alignSelf:'flex-end',fontWeight:'bold',fontSize:20}}>Battery 80% </Text></View>
        <View style={{}}><Text style={{alignSelf:'flex-end', fontWeight:'bold',fontSize:20}}>Remaining distance: 16km </Text></View>
        <Text style={{fontSize:70, fontWeight:'bold', margin:20}}>20 km/h </Text>
        <View style={styles.infoButton}>
        <Button onPress={() => bleConnector.writeBoardState("BQ==")} title="Unlock board"/>
        </View>
        <View style={styles.infoButton}>
        <Button onPress={() => bleConnector.writeBoardState("Bg==")} title="Lock board temporarily"/>
        </View>
        <View style={styles.infoButton}>
        <Button onPress={() => bleConnector.writeBoardState("CA==")} title="Impress mode"/>
        </View>
        <View style={styles.infoButton}>
        <Button onPress={() => this.setState({showWindow:true})} title="Lock & leave"/>
        </View>
        <View style={styles.infoButton}>
          <Button onPress={() => this.setState({showWindow: true})} title="Send home!"/>
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
