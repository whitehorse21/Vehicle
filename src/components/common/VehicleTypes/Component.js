import React, {Component} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {GET_VEHICLE_TYPES} from '../../../graphql/queries';
import apolloClient from '../../../graphql/client';
import styles from './Style';
import {colors} from '../../../colors';
import Spinner from '../../common/Spinner/Component';
import CloseModalButton from '../CloseModalButton/Component'

export default class VehicleTypes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      vehicleTypes: []
    }
  }

  componentWillMount() {
    this.getVehicleTypes()
  }

  getVehicleTypes = async () => {
    try {
      const result = await apolloClient.query({
        query: GET_VEHICLE_TYPES,
        fetchPolicy: 'no-cache'
      })
      if (result && result.data && result.data.getVehicalTypes) {
        this.setState({ vehicleTypes: result.data.getVehicalTypes})
      }
      this.setState({ loading: false })
    } catch (error) {
      this.setState({ loading: false })
    }
  } 

  renderVehicle = ({item, index}) => {
    return (
      <TouchableOpacity style={styles.wrapper} activeOpacity={0.8} key={item._id} onPress={() => this.props.handleVehicleType(item)}>
        <View style={styles.typeWrapper}>
          <Text style={styles.nameText}>{item.name}</Text>
          {item.dimension !== undefined && <Text style={styles.infoText}>{item.dimension.width}x{item.dimension.height}x{item.dimension.length}</Text>}
          <Text style={styles.infoText}>{item.capacity}Kg</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <CloseModalButton onPress={this.props.closeModal}/>
        { this.state.loading ? 
          <Spinner backgroundColor={colors.blue} indicatorColor={colors.lightBlue} /> 
        :
          <FlatList
            keyExtractor={(vehicle, index) => index.toString()}
            data={this.state.vehicleTypes}
            extraData={this.state}
            renderItem={vehicle => this.renderVehicle(vehicle)}
            numColumns={2}
            bounces={false}
            contentContainerStyle={styles.containerStyle}
          /> 
        }  
      </View>
    )
  }
}