import { Navigation } from 'react-native-navigation';
import {Dimensions} from 'react-native';
import {getData} from '../storage';

const windowWidth = Dimensions.get('window').width;

export function goToAuth() {
  Navigation.setDefaultOptions({
    animations: {
      setRoot: {
        waitForRender: true,
      }
    },
    topBar: {
      visible: false
    }
  })
  
  Navigation.setRoot({ 
    root: {
      stack: {
          children: [{
            component: {
                name: 'Login'
            }
          }]
      }
    }  
  })
}

export function navigateToScreen(componentId, screenId, props, animation) {
  Navigation.setDefaultOptions({
    animations: {
      setRoot: {
        waitForRender: true,
      }
    },
    topBar: {
      visible: false
    }
  })
  
	Navigation.push(componentId, {
    component: {
      name: screenId,
      passProps: {
        ...props
      },
      options: {
        ...animation
      }   
    }
  });
}

export function startSingleScreenApp(screenId) {
  Navigation.setDefaultOptions({
    animations: {
      setRoot: {
        waitForRender: true,
      }
    },
    topBar: {
      visible: false
    }
  })
  
  Navigation.setRoot({
    root: {
      stack: {
        children: [{
          component: {
              name: screenId
          }
        }]
      }
    }  
  });
}

export async function startInitialisation() {
  const userType = JSON.parse(await getData('userType'))

  Navigation.setDefaultOptions({
    animations: {
      setRoot: {
        waitForRender: true,
      }
    },
    topBar: {
      visible: false
    }
  })

  if(userType && userType === 'admin') {
    Navigation.setRoot({ 
      root: {
        stack: {
            children: [{
              component: {
                id: 'Home',
                name: 'Home',  
              }
            }]
        }
      }
    })
  } else {
    Navigation.setRoot({
      root: {
        sideMenu: {
          left: {
            component: {
              id: 'SideMenu',
              name: 'SideMenu'
            }
          },
          center: {
            stack: {
              children: [
                {
                  component: {
                    id: 'Home',
                    name: 'Home',
                  }
                }
              ],
            }
          },
          options: {
            sideMenu: {
              left: {
                width: windowWidth, 
                visible: false
              },
            },
          }
        }
      }
    })
  }
}