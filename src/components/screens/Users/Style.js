import {StyleSheet, Dimensions} from 'react-native';
import {colors} from '../../../colors';
import {shadow} from '../../../common_style';

const windowWidth = Dimensions.get('window').width

const button = {
  height: 40,
  width: 140,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 6
}

const styles = StyleSheet.create({
	container: {
  	flex: 1,
  	backgroundColor: colors.blue
	},
  searchWrapper: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 30
  },
  searchIcon: {
    position: 'absolute',
    left: 270,
    zIndex: 2
  },
  searchTextInput: {
    position: 'relative',
    width: 300,
    backgroundColor: colors.white,
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: colors.blue,
    borderRadius: 32,
    paddingVertical: 10,
    paddingLeft: 15,
    paddingRight: 38,
    textAlign: 'center'
  },
  tabWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.aquaBlue
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    letterSpacing: 0.80,
    textTransform: 'uppercase',
    paddingVertical: 10,
    paddingHorizontal: 8
  },
  flatList: {
    flex: 1,
    marginHorizontal: 25,
    marginBottom: 20
  },
  containerStyle: {
    flexGrow: 1
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8
  },
  imageWrapper: {
    height: 42,
    width: 42,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 30
  },
  image: {
    height: 42,
    width: 42,
    borderRadius: 21,
    marginRight: 30,
    backgroundColor: colors.white
  },
  nameText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: colors.white,
    width: windowWidth - 132,
    paddingVertical: 8
  },
  modalContentView: {
    flex: 1,
    margin: 10,
    justifyContent: 'center'
  },
  infoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10
  },
  leftWrapper: {
    alignItems: 'center'
  },
  avtarWrapper: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  avtar: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginBottom: 8,
    backgroundColor: colors.white
  },
  inlineLabelTextInput: {
    height: 35,
    width: 200,
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: colors.white,
    borderRadius: 32,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.white,
    marginBottom: 6
  },
  text: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: colors.white,
    marginBottom: 10
  },
  pickerButton: {
    height: 35,
    width: 200,
    borderRadius: 32,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    justifyContent: 'center',
    ...shadow
  },
  pickerText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: colors.violet,
    textTransform: 'capitalize'
  },
  pickerStyle: {
    width: 200,
    height: 58,
    alignSelf: 'flex-start'
  },
  wrapper: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  saveButton: {
    ...button,
    backgroundColor: colors.aquaBlue
  },
  removeButton: {
    ...button,
    backgroundColor: colors.red,
    marginLeft: 20
  },
  buttonText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 1,
    color: colors.white
  },
  notFoundText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: colors.white,
    textAlign: 'center',
    marginTop: 20
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