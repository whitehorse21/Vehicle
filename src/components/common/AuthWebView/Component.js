import React, { Component } from 'react';
import { Platform, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import ModalBox from '../ModalBox/Component';
import {Close} from '../../../../assets';
import styles from './Style';
import {colors} from '../../../colors';
import config from '../../../../config';
import { WebView } from 'react-native-webview';

const userAgent = (Platform.OS === 'ios')
    ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
    : 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13E233 Safari/601.1';

export default class AuthWebView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            paymentLoading: false
        }
    }

    componentWillUnmount() {
        if (this.timeOut) clearTimeout(this.timeOut);
    }

    onNavigationStateChange = (webViewState) => {
        const url = decodeURIComponent(webViewState.url)
        if (url.indexOf('mercadopago?code=') != -1) {
            this.setState({ paymentLoading: true })
            var code = url.split('code=')[1];
            const { paymentInfo } = this.props
            if(code) this.props.closeModal(code, paymentInfo && paymentInfo.type)
        }
    }

    handleMessage = (event) => {
        if (event.nativeEvent && event.nativeEvent.data) {
            const value = decodeURIComponent(decodeURIComponent(event.nativeEvent.data))
            if (value && value != '[object Object]') {
                const { paymentInfo } = this.props
                const objValue = JSON.parse(value);
                if (objValue && objValue.value) {
                    if (Platform.OS === 'ios' || (objValue.type == 'submit')) {
                        const dataValue = {}
                        objValue.value.forEach((item) => {
                            dataValue[item.id] = item.value
                        })
                        console.log(dataValue, 'IOS')
                        this.props.closeModal(dataValue, paymentInfo && paymentInfo.type);
                    } else {
                        console.log(objValue, 'Android')
                        this.props.closeModal(objValue, paymentInfo && paymentInfo.type);
                    }
                } else {
                    if (objValue.token) {
                        this.props.closeModal(objValue, paymentInfo && paymentInfo.type);
                    }
                }
            }
        }
    }

    renderWebview = () => {
        const props = this.props
        const uri = `https://auth.mercadopago.com.ar/authorization?client_id=${config.merchadopago.appId}` +
                    `&response_type=code&platform_id=mp&redirect_uri=${config.merchadopago.redirectURI}`;
        const jsCode = `(function() {
            var originalPostMessage = window.postMessage;
            var patchedPostMessage = function(message, targetOrigin, transfer) {
                // alert(JSON.stringify(message));
                originalPostMessage(JSON.stringify(message), targetOrigin, transfer);
            };
            patchedPostMessage.toString = function() {
              return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
            };
            window.postMessage = patchedPostMessage;
        })();`;
        const merchadoFile = Platform.OS === 'ios' ? 'https://www.mahardhi.com/js/mercado.js' : 'https://mahardhi.com/js/mercado-android.js'
        
        if(props.paymentInfo && props.paymentInfo.type === 'payment') {
            return (
                <WebView
                    javaScriptEnabled={true}
                    injectedJavaScript={jsCode}
                    source={{ html: `
                        <head><meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"></head>
                        <script src="https://www.mercadopago.com/v2/security.js" view=""></script>
                        <script src='${merchadoFile}'></script>
                        <script>
                            window.onload = function() {
                                $MPC.openCheckout({
                                    url: "https://www.mercadopago.com.ar/checkout/v1/modal?public-key=${props.paymentInfo.publicKey}&amp;transaction-amount=${props.paymentInfo.amount}",
                                    mode: "modal",
                                    onreturn: function(data) {
                                        window.postMessage(JSON.stringify(data), '*');
                                    }
                                });
                            };

                        </script>`, baseUrl: ''}}
                    userAgent={userAgent}
                    originWhitelist={['file://', 'https://*']}
                    onLoadStart={() => {
                        this.setState({ loading: true });
                    }}
                    onLoadEnd={() => {
                        this.setState({ loading: false });
                    }}
                    onLoad={() => {
                        if(!this.timeOut) {
                            this.timeOut = setTimeout(() => {
                                this.setState({ paymentLoading: false })
                            }, 3000)
                        }
                    }}
                    bounces={false}
                    onMessage={this.handleMessage}
                />
            )
        } 
        return (
            <WebView
                useWebKit
                source={{ uri }}
                userAgent={userAgent}
                onNavigationStateChange={this.onNavigationStateChange}
                onLoadStart={() => {
                    this.setState({ loading: true });
                }}
                onLoadEnd={() => {
                    this.setState({ loading: false });
                }}
            />
        )
    }

    render() {
        const props = this.props
        const {loading, paymentLoading} = this.state
        const {height, width} = Dimensions.get('window')
        return (
            <ModalBox
                displayModal={this.props.displayModal}
                closeModal={() => props.closeModal()}
                style={{ height: height - 30, width }}
            >
                <React.Fragment>
                    <TouchableOpacity style={styles.closeContainer} activeOpacity={0.8} onPress={() => props.closeModal()}>
                       <Close width={30} height={30} />
                    </TouchableOpacity>
                    {this.renderWebview()}
                    {(loading || paymentLoading) ? <ActivityIndicator size='large' style={styles.loading} color={colors.blue} /> : null }
                </React.Fragment>
            </ModalBox>
        );
    }
}