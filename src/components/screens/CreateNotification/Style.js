import {StyleSheet, Dimensions} from 'react-native';
import {colors} from '../../../colors';
import {shadow} from '../../../common_style';

const windowWidth = Dimensions.get('window').width

const text = {
  fontSize: 14,
  fontFamily: 'Montserrat-Regular',
  color: colors.white
}

const button = {
  height: 35,
  width: 120,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 32
}

const styles = StyleSheet.create({
	container: {
  	flex: 1,
  	backgroundColor: colors.blue
	},
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'space-evenly'
  },
  titleWrapper: {
    marginTop: 10,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.aquaBlue,
    alignSelf: 'center',
    width: windowWidth - 120,
    paddingBottom: 2
  },
  titleText: {
    ...text,
    textAlign: 'center',
    marginBottom: 5
  },
  notificationWrapper: {
    height: 95,
    marginLeft: 35,
    marginRight: 25
  },
  flatList: {
    flex: 1
  },
  notificationView: {
    width: windowWidth - 75,
    borderRadius: 32,
    paddingVertical: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 15
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: colors.violet
  },
  addNotificationWrapper: {
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.aquaBlue,
    padding: 12,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10
  },
  wrapper: {
    width: '80%',
    alignSelf: 'center'
  },
  text: {
    ...text,
    marginTop: 5,
    marginBottom: 4,
    marginLeft: 10
  },
  titleTextInput: {
    height: 35,
    width: '100%',
    ...text,
    borderRadius: 32,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.white,
  },
  picker: {
    height: 35,
    width: '100%',
    borderRadius: 32,
    borderColor: colors.white,
    borderWidth: 1,
    paddingHorizontal: 15,
    justifyContent: 'center'
  },
  arrowIcon: {
    position: 'absolute',
    height: 18,
    width: 18,
    tintColor: colors.white,
    right: 15
  },
  pickerText: {
    ...text,
    textTransform: 'capitalize'
  },
  bodyTitleText: {
    ...text,
    width: '80%',
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 4,
    marginLeft: 10
  },
  bodyWrapper: {
    height: 100,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  msgTextInput: {
    height: 90,
    width: '90%',
    ...text,
    textAlignVertical: 'top',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingRight: 5 
  },
  buttonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  sendButton: {
    ...button,
    backgroundColor: colors.aquaBlue
  },
  cancelButton: {
    ...button,
    backgroundColor: colors.red,
    marginLeft: 20
  },
  buttonText: {
    ...text
  },
  notFoundText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: colors.white,
    textAlign: 'center',
    marginTop: 25
  },
  iconWrapper: {
		position: 'absolute',
    bottom: 0,
    right: 0,
		height: 90,
		width: 90,
		backgroundColor: colors.lightBlue,
		borderRadius: 45,
	    marginRight: -30,
	    marginBottom: -30
	},
	homeIcon: {
		height: 29,
		width: 29,
		tintColor: colors.blue, 
		left: 20,
		top: 18
	},
})

export default styles