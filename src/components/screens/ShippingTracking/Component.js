import React, {Component} from 'react';
import {View, Text, TextInput, Image, Platform} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import apolloClient from '../../../graphql/client';
import {GET_CARRIER_LOCATION} from '../../../graphql/queries';
import {Navigation} from 'react-native-navigation'
import styles from './Style';
import { colors } from '../../../colors';
import {images} from '../../../../assets';
import config from '../../../../config';
import OfflineNotice from '../../common/OfflineNotice/Component';
import TopNavBar from '../../common/TopNavBar/Component';
import Spinner from '../../common/Spinner/Component';

const LATITUDE = -34.605914
const LONGITUDE = -58.453213

class ShippingTracking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: props.shipment && props.shipment.origin && props.shipment.origin.location ? Number(props.shipment.origin.location.lat) : LATITUDE,
      longitude: props.shipment && props.shipment.origin && props.shipment.origin.location ? Number(props.shipment.origin.location.lng) : LONGITUDE,
      currentLocation: null,
      isConnected: true,
      loading: true
    }
    this.watch = true
  }

  async componentWillMount() {
    this.setSubscriptionToCarrierLocation()
  }

  componentWillUnmount() {
    if (this.observableQuery) {
      this.observableQuery.unsubscribe()
    }     
  }

  onConnectionChanged = async (isConnected) => {
    if (isConnected) {
      if (this.observableQuery && this.observableQuery._state !== 'closed') {
        this.observableQuery.unsubscribe()
      }
      this.setSubscriptionToCarrierLocation()
    }
    this.setState({ isConnected })
  }

  setSubscriptionToCarrierLocation = async () => {
    try {
      this.observableQuery = await apolloClient.watchQuery({
        query: GET_CARRIER_LOCATION,
        variables: {
          carrierId: this.props.shipment.carrierId  
        },
        fetchPolicy: 'no-cache',
        pollInterval: 500
      }).subscribe({
        next: ({ data }) => {
          if(data && data.getCarrierLocation && this.watch) this.handleLocationChange(data.getCarrierLocation)
          else this.setState({ loading: false })
        },
        error: (error) => {
          this.setState({ loading: false })
        }
      })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  handleLocationChange = async (coords) => {
    const latitude = Number(coords.lat)
    const longitude = Number(coords.lng)

    const distance = await this.getDistance(latitude, longitude)
    if(!distance || (distance && distance > 10)) {
      this.setState({ currentLocation: { latitude, longitude }, latitude, longitude, loading: false })
    } else {
      this.watch = false
      this.setState({ loading: false })
      this.observableQuery.unsubscribe()
    }
  }

  getDistance = async (latitude, longitude) => {
    const { props } = this
    if(props.shipment && props.shipment.destination && props.shipment.destination.location) {
      const currentPoint = latitude + "," + longitude
      const destinationPoint = props.shipment.destination.location['lat'] + "," + props.shipment.destination.location['lng']
      const distance = await fetch('https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + currentPoint + '&destinations=' + destinationPoint + '&key=' + config.google.apiKey)
        .then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.status === 'OK') {
            return responseJson.rows[0].elements[0].distance.value
          } else {
            return;
          }
        })
        .catch((error) => { 
          return;
        })
      return distance
    } 
    return;
  }

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009
  })

  render() {
    const { props } = this
    const { currentLocation, latitude, longitude, loading } = this.state
   
    return (
      <View style={styles.container}>
        <OfflineNotice onConnectionChanged={this.onConnectionChanged} />
        <TopNavBar title={'SEGUIMIENTO DE ENVÍO'} componentId={this.props.componentId} />
        {loading ? 
          <Spinner /> 
        :
          <View style={styles.mapWrapper}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              loadingEnabled={true}
              loadingIndicatorColor={colors.blue}
              loadingBackgroundColor={colors.lightBlue}
              region={this.getMapRegion()}
            >
              {props.shipment && props.shipment.origin && props.shipment.origin.location &&
                <Marker 
                  pinColor={colors.lightGreen}
                  coordinate={{latitude: Number(props.shipment.origin.location.lat), longitude: Number(props.shipment.origin.location.lng)}}
                />
              }
              {props.shipment && props.shipment.destination && props.shipment.destination.location &&
                <Marker 
                  pinColor={colors.navyBlue}
                  coordinate={{latitude: Number(props.shipment.destination.location.lat), longitude: Number(props.shipment.destination.location.lng)}}
                />
              }
              {currentLocation && props.shipment && props.shipment.destination && props.shipment.destination.location &&
                <MapViewDirections
                  origin={{
                    'latitude': currentLocation.latitude,
                    'longitude': currentLocation.longitude
                  }}
                  destination={{
                    'latitude': Number(props.shipment.destination.location.lat),
                    'longitude': Number(props.shipment.destination.location.lng)
                  }}
                  strokeWidth={5}
                  apikey={config.google.apiKey}
                  resetOnChange={false}
                />
              }
              {currentLocation && 
                <Marker
                  coordinate={currentLocation}
                />
              }
            </MapView>
          </View>
        }
        <View style={styles.mainWrapper}>
          {props.shipment && props.shipment.origin && props.shipment.origin.address && (
            <View style={styles.locationBoxWrapper}> 
              <Image source={images.location} resizeMode={'contain'} style={styles.originIcon} />
              <Text style={styles.locationText} numberOfLines={2} ellipsizeMode={'tail'}>{props.shipment.origin.address}</Text> 
            </View>
          )}
          {props.shipment && props.shipment.destination && props.shipment.destination.address && (
            <View style={styles.locationBoxWrapper}> 
              <Image source={images.location} resizeMode={'contain'} style={styles.destinationIcon} />
              <Text style={styles.locationText} numberOfLines={2} ellipsizeMode={'tail'}>{props.shipment.destination.address}</Text> 
            </View>
          )}
        </View>
      </View>
    )
  }
}

export default ShippingTracking