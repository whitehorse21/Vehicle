import { StyleSheet, Platform } from 'react-native'
import { colors } from '../../../colors'

const styles = StyleSheet.create({
	modalContent: {
    flex: 1,
    margin: 5
  },
  closeIconWrapper: {
    paddingTop: 2,
    paddingRight: 2
  },
  closeIcon: {
    alignSelf: 'flex-end'
  },
  scrollContainer: {
    flexGrow: 1,
    marginBottom: 20
  },
  titleText: {
    fontSize: 14,
    color: colors.white,
    alignSelf: 'center',
    marginBottom: 10,
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.80
  },
  subTitleText: {
    fontSize: 14,
    color: colors.white,
    marginTop: 5,
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
    marginHorizontal: 15,
    letterSpacing: 0.80
  },
  tosText: {
    marginHorizontal: 15,
    marginBottom: 10,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: colors.white,
  },
  underlineText: {
    textDecorationLine: 'underline'
  },
  italicText: {
    textAlign: "justify",
    marginHorizontal: 15,
    marginBottom: 10,
    fontSize: 14,
    color: colors.white,
    fontStyle: 'italic'
  },
  textItalic: {
    fontFamily: 'Montserrat-Italic'
  },
  textBold: {
    fontFamily: 'Montserrat-Bold'
  },
  textSemiBold: {
    fontFamily: 'Montserrat-Medium'
  },
  textItalicBold: {
    fontFamily: 'Montserrat-BoldItalic'
  },
  textStrike: {
    textDecorationLine: 'line-through'
  },
  linkText: {
    color: colors.aquaBlue
  }
})

export default styles