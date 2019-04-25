import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MapView, Permissions } from 'expo';

export default class App extends React.Component {
  state = {
    latitude: null,
    longitude: null
  }

  async componentDidMount () {
    const { status } = await Permissions.getAsync(Permissions.LOCATION)

    if (status !== 'granted') {
      const response = await Permissions.getAsync(Permissions.LOCATION)
    }
    // 2 params
    navigator.geolocation.getCurrentPosition(
      ({ coords: {latitude, longitude} }) => this.setState({longitude, latitude}, () => console.log('hi') ),
      (error) => console.log('error')
    )
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
