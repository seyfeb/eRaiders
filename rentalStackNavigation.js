import React, { Component } from 'react';
import { TouchableOpacity, Text, TextInput, View } from 'react-native';
import { StackNavigator} from 'react-navigation'

// import Mapbox from '@mapbox/react-native-mapbox-gl';
// import IOSIcon from "react-native-vector-icons/Ionicons";
// import DetailScreen from './detail';
// import MainScreen from './main';

// const rentalStackNav = StackNavigator({
//     Main: {
//         screen: MainScreen,
//         navigationOptions:({navigation}) => ({
//             title: "Main",
//             headerLeft:(
//               <TouchableOpacity onPress={() => navigation.navigate("DrawerOpen")}>
//                 <IOSIcon name="ios-menu" size={30} />
//               </TouchableOpacity>
//             ),
//             headerStyle: { paddingRight: 10, paddingLeft: 10 }
//         })
//     },
//     Detail: {
//         screen: DetailScreen,
//         navigationOptions: (props) => ({
//             title: "Detail",
//         })
//     }
// })

class PickupLocationSelectionScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: '' };
    }


  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{height: 40, borderColor: 'gray', borderWidth: 0}}>Select your pick-up location!</Text>
        <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1, backgroundColor: 'white', minWidth: 200}}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
        />
      </View>
    );
  }
}

const rentalStackNav = StackNavigator({
    // For each screen that you can navigate to, create a new entry like this:
    Location: {
    // `ProfileScreen` is a React component that will be the main content of the screen.
    screen: PickupLocationSelectionScreen,
    // When `ProfileScreen` is loaded by the StackNavigator, it will be given a `navigation` prop.

  
    // Optional: Override the `navigationOptions` for the screen
    navigationOptions: ({ navigation }) => ({
      title: "Pick-up location",
    }),
  },

});

export default rentalStackNav;