import React, { Component } from 'react';
import { Platform, View, Text, PermissionsAndroid } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

import {Buffer} from 'buffer'

import base64 from 'react-native-base64'

async function requestLocationPermission() {
	try {
	  const granted = await PermissionsAndroid.request(
	    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
	    {
	      'title': 'eRaiders location Permission',
	      'message': 'We need your location for BLE ?! ' +
	                 'Dont know why.'
	    }
	  )
	  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
	  	this.permisions.loaction = true;
	    console.log("Location permission granted")
	  } else {
	    console.log("Location permission denied")
	  }
	} catch (err) {
	  console.warn(err)
	}
}

class BleComponent {

  constructor() {
    this.manager = new BleManager();
    this.state = {info: "", values: {}};
    this.deviceNames=[];
    this.serviceUUID = '27c4f653-0161-44c6-b269-5aed63f37dab';
    this.writeUUID = '40fd3b0b-2f38-4e37-a149-4ca4a7547121';
    this.device = undefined;

    this.sensors = {
      0: "Temperature",
      1: "Accelerometer",
      2: "Humidity",
      3: "Magnetometer",
      4: "Barometer",
      5: "Gyroscope"
    };
    this.permissions = {location: false};

    requestLocationPermission();
  }

  updateValue(key, value) {
    this.values = {...this.state.values, [key]: value}
  }

  componentWillMount() {
    if (Platform.OS === 'ios') {
      this.manager.onStateChange((state) => {
        if (state === 'PoweredOn') this.scanAndConnect()
      })
    } else {
      this.scanAndConnect()
    }
  }

  // getSomeDevices() {

  // 	// if (!this.permissions.location)
  // 	// {
  // 	// 	return;
  // 	// }

  // 	this.manager.startDeviceScan(null,
  //                                null, (error, device) => {
  //     this.state.info = "Scanning...";
  //     // console.log(device);
  //     // console.warn(device);

  //     if (error) {
  //       console.error(error.message);
  //       return;
  //     }


  //   if (device.name) { // Creating an array of devices with names
  //   	console.warn(device.name);
  //       if (this.deviceNames.indexOf(device.name) === -1) {
  //           this.deviceNames.push(device.name);
  //           console.log('Found new device: ', device);
  //       }
  //   }

  //     if (this.deviceNames.length > 5)
  //     	this.manager.stopDeviceScan()
  //     });

  // 		// return this.deviceNames;


  // }

// When device is found, scanning is stopped and we try to connect to it, discover characteristics and setup notifications.
  async scanAndConnect() {
    this.manager.startDeviceScan(null,
                                 null, (error, device) => {
      this.state.info = "Scanning...";
      console.log(device);

      if (error) {
        console.error(error.message);
        return;
      }
      //if(device.name)
	      //console.warn(device.name)

      if (device.name === 'eRaiders') {
        // this.info("Connecting to TI Sensor")
        this.manager.stopDeviceScan()
        device.connect()
          .then((device) => {
            this.state.info = "Discovering services and characteristics";
            return device.discoverAllServicesAndCharacteristics()
          })
          // .then((device) => {
          //   this.state.info = "Setting notifications";
          //   return this.setupNotifications(device)
          // })
          .then((device) => {
          	console.warn('Connected to '+device.name);
          	//device.services().then((services) => {for (s in services) {console.warn(services[s].uuid)}}
          	//	);
            this.state.info = "Listening...";
            this.device = device;
          }, (error) => {
            console.error(error.message)
          })
      }
    });
  }


// enable notifications for specified sensor by writing value of 0x01 to configuration characteristic. 
// After write is completed sensor is activated and ready for listening to it’s values
  async setupNotifications(device) {
    for (const id in this.sensors) {
      const service = this.serviceUUID(id)
      const characteristicW = this.writeUUID(id)
      const characteristicN = this.notifyUUID(id)

      const characteristic = await device.writeCharacteristicWithResponseForService(
        service, characteristicW, "AQ==" /* 0x01 in hex */
      )

      device.monitorCharacteristicForService(service, characteristicN, (error, characteristic) => {
        if (error) {
          this.error(error.message)
          return
        }
        this.updateValue(characteristic.uuid, characteristic.value)
      })
    }
  }
  writeBoardState (value64) {
  	if(this.device === undefined)
  	{
  		console.warn('Not connected to bluetooth device');
  		return;
  	}
     // console.warn(base64.encode(value));
    //const value64 = new Buffer(value).toString("base64");
    this.device.readCharacteristicForService(this.serviceUUID, this.writeUUID).then( (characteristic) => {
  		// console.warn(new Buffer(characteristic.value, 'base64').toString());
  	return characteristic.writeWithoutResponse( 
        value64 //"AQ==" /* 0x01 in hex */
      )});
  }

}



export default bleConnector = new BleComponent();



