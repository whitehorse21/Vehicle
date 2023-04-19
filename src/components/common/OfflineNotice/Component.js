import React, { Component } from 'react';
import NetInfo from "@react-native-community/netinfo";

class OfflineNotice extends Component {
  componentWillMount() {
    this.checkConnection()
    this.subscription = NetInfo.addEventListener(this.handleConnectionChange)
  }

  componentWillUnmount() {
    this.subscription && this.subscription()
  }

  checkConnection = () => {
    NetInfo.fetch().then(state => {
      if (this.props.onConnectionChanged) {
        this.props.onConnectionChanged(state.isConnected)
      }
    });
  }

  handleConnectionChange = (connectionInfo: NetInfoState) => {
    if (this.props.onConnectionChanged) {
      this.props.onConnectionChanged(connectionInfo.isConnected)
    }
  }

  render() {
    return null;
  }
}

export default OfflineNotice;