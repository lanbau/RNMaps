import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MapView, Permissions } from 'expo';
import Polyline from '@mapbox/polyline'
const locations = require('./locations.json');

export default class App extends React.Component {
  state = {
    latitude: null,
    longitude: null,
    locations: locations
  };

  async componentDidMount () {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      const response = await Permissions.getAsync(Permissions.LOCATION);
    }

    // 2 params
    navigator.geolocation.getCurrentPosition(
      ({ coords: {latitude, longitude} }) => this.setState({longitude, latitude}, () => console.log('hi') ),
      (error) => console.log('error')
    )
    
    // how does the inner array destructure?
    // https://stackoverflow.com/questions/37606427/nested-es6-array-destructuring
    // To get the 1st child-array's 1st element
    // let [[x]] = [[1], [1, 2], [1, 2, 3]]
    // To get the 2nd child-array's 1st element
    // let [ , [x]] = [[1], [1, 2], [1, 2, 3]]

    const { locations: [ , sampleLocation ] } = this.state

    this.setState({
      desLatitude: sampleLocation.coords.latitude,
      desLongitude: sampleLocation.coords.longitude
    }, () => {});

  }

  mergeCoords = () => {
    const {
      latitude,
      longitude,
      desLatitude,
      desLongitude
    } = this.state
    const hasStartAndEnd = latitude !== null && desLatitude !== null
    if (hasStartAndEnd) {
      const concatStart = `${latitude}, ${longitude}`
      const concatEnd = `${desLatitude}, ${desLongitude}`
      this.getDirections(concatStart, concatEnd)
    }
  }

  async getDirections (startLoc, endLoc) {
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${endLoc}&`)
      const resJson = await res.json()
      const points = Polyline.decode(resJson.routes[0].overview_polyline)
      const coords = points.map(point => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      })
      this.setState({coords})
    }
    catch (error) {
      console.log(error)
    }
  }

  render() {

    const { latitude, longitude } = this.state

    if (latitude) {
      return (
        this.state.latitude !== null &&
          <MapView
            showsUserLocation
            style={{flex:1}}
            initialRegion= {{
              latitude,
              longitude,
              latitudeDelta: 1.289648,
              longitudeDelta: 103.816768
            }} 
          >
          </MapView>
      );
    }
    return (
      <View>
        <Text>We Need Your Permission Dude.</Text>
      </View>
    );

    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
