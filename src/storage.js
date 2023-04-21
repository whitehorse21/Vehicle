import AsyncStorage from '@react-native-async-storage/async-storage';

export const setData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
};

export const getData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    return undefined;
  }
};

export const deleteData = async key => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
};

export const setMultipleData = async (keyValuePairs, cb) => {
  const withStrigifiedValues = [];

  keyValuePairs.forEach(pair => {
    const keyValue = [pair[0], JSON.stringify(pair[1])];
    withStrigifiedValues.push(keyValue);
  });
  try {
    await AsyncStorage.multiSet(withStrigifiedValues, cb);
    return true;
  } catch (error) {
    return false;
  }
};
