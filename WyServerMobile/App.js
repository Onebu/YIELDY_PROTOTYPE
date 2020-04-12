import React, { useState } from 'react';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { enableScreens } from 'react-native-screens';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';


import ScreenNavigator from './navigation/ScreenNavigator';
import NavigationContainer from './navigation/NavigationContainer';
import authReducer from './store/reducers/auth';
import groupReducer from './store/reducers/group';
import commentReducer from './store/reducers/comment';
import serverReducer from './store/reducers/server';

enableScreens();

const rootReducer = combineReducers({
  auth:authReducer,
  group:groupReducer,
  comment:commentReducer,
  server:serverReducer
});

const store = createStore(rootReducer,applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
      />
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}