import React, {Component} from "react";
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import {connect} from "react-redux";
import styles from './Style';
import {GET_VEHICLE_TYPES} from '../../../graphql/queries';
import apolloClient from '../../../graphql/client';
import TopNavBar from '../../common/TopNavBar/Component';
import {navigateToScreen} from '../../../navigation/navigation_settings';
import {images} from '../../../../assets';
import Spinner from '../../common/Spinner/Component';
import InformationBar from '../../common/InformationBar/Component';

class ChooseVehicle extends Component {
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
    const vehicleImages = [
      images.vehicle1,
      images.vehicle2,
      images.vehicle3, 
      images.vehicle4,
      images.vehicle5,
      images.vehicle6, 
    ]
    const data = {dimensions: item.dimension.width + 'x' + item.dimension.height + 'x' + item.dimension.length, weight: item.capacity}
    return (
      <TouchableOpacity style={styles.boxWrapper} key={index} activeOpacity={0.8} onPress={() => navigateToScreen(this.props.componentId, 'ChooseLocation', {title: 'CONOZCO EL VEHÍCULO', data})}>
        <Image source={vehicleImages[index]} style={styles.image} resizeMode={'contain'} />
        <Text style={styles.vehicleTypeText}>{item.name}</Text>
        {item.dimension !== undefined && <Text style={styles.infoText}>{item.dimension.width}x{item.dimension.height}x{item.dimension.length}</Text>}
        <Text style={styles.infoText}>{item.capacity}Kg</Text>
      </TouchableOpacity>
    )
  }

	render() {
    const { loading } = this.state
  	return (
  		<View style={styles.container}>
        <TopNavBar title={'CONOZCO EL VEHÍCULO'} componentId={this.props.componentId} />
        <InformationBar titleText={'¿Qué vehículo necesitas para tu flete?'} />
        { loading ? 
          <Spinner /> 
        :
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={this.state.vehicleTypes}
            renderItem={item => this.renderVehicle(item)}
            numColumns={2}
            bounces={false}
            contentContainerStyle={styles.containerStyle}
          /> 
        }  
  		</View>
  	);
	}
}

export default ChooseVehicle