import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../colors';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        elevation: 999,
        alignItems: 'center',
        zIndex: 10000,
    },
    content: {
        backgroundColor: colors.lightBlue,
        borderRadius: 22,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    text: {
        color: colors.violet,
        fontFamily: 'Montserrat-Regular'
    }
});

export default styles