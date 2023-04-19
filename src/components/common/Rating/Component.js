import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import {graphql, compose} from 'react-apollo';
import {ADD_CARRIER_RATING} from '../../../graphql/mutations';
import styles from './Style';
import {images, Camera} from '../../../../assets';
import { colors } from '../../../colors';

class Rating extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rating: 0
    }
  }

  renderStars = () => {
    const props = this.props
    const { rating } = this.state
    const stars = []
    if(props.notification && props.notification.rating) {
      for (let i = 1; i <= 5; i++) {
        stars.push(
          <Image 
            source={i <= props.notification.rating ? images.fullStar : images.star} 
            resizeMode={'contain'} style={[styles.starImage, {tintColor: i <= props.notification.rating ? colors.yellow : colors.white}]} 
            key={i}
          />
        )
      }
    } else {
      for (let i = 1; i <= 5; i++) {
        stars.push(
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.setState({ rating: i })} key={i}>
            <Image 
              source={i <= rating ? images.fullStar : images.star} 
              resizeMode={'contain'} style={[styles.starImage, {tintColor: i <= rating ? colors.yellow : colors.white}]} 
            />
          </TouchableOpacity>
        )
      }
    }
    return stars
  }

  handleRating = async () => {
    const props = this.props
    const { rating } = this.state
    if(rating > 0) {
      if(props.notification && props.notification.shipmentId && props.notification.shipment && props.notification.shipment.carrierId) {
        try {
          const result = await this.props.addCarrierRating({
            variables: {
              shipmentId: props.notification.shipmentId,
              rating,
              carrierId: props.notification.shipment.carrierId
            }
          })
          if (result && result.data && result.data.addCarrierRating) {
            this.props.displayRatingMsg('Gracias por calificar')
            if(props.fetchNotifications) await props.fetchNotifications()
          }
        } catch (error) {
          this.props.displayRatingMsg('no se puede enviar calificación')
        }
      } else {
        this.props.displayRatingMsg('no se puede enviar calificación')
      }
    } else {
      this.props.displayRatingMsg('Por favor, selecciona una calificación')
    }
  }

  render() {
    const {notification} = this.props
    return (
      <View>
        <View style={styles.rowWrapper}>
          {notification.freightRequest && notification.freightRequest.carrier && notification.freightRequest.carrier.image ?
            <Image source={{ uri: notification.freightRequest.carrier.image }} style={styles.image} />
          :
            <View style={styles.imageWrapper}>
              <Camera />
            </View>
          }
          <View>
            <Text style={styles.infoText}>¡Califica a tu transportista!</Text>
            <View style={styles.starWrapper}>
              {this.renderStars()}
            </View>
          </View>
        </View>
        {(notification && !notification.rating) && (
          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => this.handleRating()}>
            <Text style={styles.buttonText}>Calificar</Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const withMutation = (
  graphql(ADD_CARRIER_RATING, { name: 'addCarrierRating' })
)(Rating);

export default withMutation;