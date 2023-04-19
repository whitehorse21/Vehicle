import { StyleSheet, Dimensions} from 'react-native';
import { colors } from '../../../colors';


const styles = StyleSheet.create({
	header_view: {
        width: '100%',
        paddingVertical: 10,
        backgroundColor: '#ffffff'
    },
    backbutton_view: {
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    backbutton_image: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: colors.navyBlue
    },
    backbutton_text: {
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        color: colors.navyBlue,
        marginLeft: 5
    }
})

export default styles