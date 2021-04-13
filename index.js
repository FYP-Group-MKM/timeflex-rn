import React from 'react';
import { AppRegistry, Text } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import App from './App';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

const Main = () => {
    return (
        <StoreProvider store={store} >
            <PaperProvider>
                <App />
            </PaperProvider>
        </StoreProvider>
    );
}

AppRegistry.registerComponent('timeflex-rn', () => Main);
export default Main;