#### Instructions
1.  Install the dependencies:
```
npm install
```
2.  In node_modules/expo/AppEntry.js, replace the whole file with the following:
```
import registerRootComponent from 'expo/build/launch/registerRootComponent';

import index from '../../index';

registerRootComponent(index);
```
3.  Run the app on Expo Go on a simulator
```
npm run ios
```
4.  Or compile the app and install it on a simulator, by dragging the compiled app icon to the homescreen
```
expo build:ios -t simulator
```
