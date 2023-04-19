import {Platform} from 'react-native';
export const shadow =  {
	...Platform.select({
    	ios: {
	        shadowRadius: 2,
	        shadowColor: 'rgba(0, 0, 0, 1.0)',
	        shadowOpacity: 0.54,
	        shadowOffset: { width: 0, height: 2 },
	    },
	    android: {
	        elevation: 3
	    }
	})
}