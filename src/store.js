import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import api from './middleware/api'
import fecitApp from './reducers'

let createStoreWithMiddleware = applyMiddleware(thunkMiddleware, api)(createStore)
export default createStoreWithMiddleware(fecitApp)
