#### Instructions
1. In node_modules/expo/AppEntry.js, replace the whole file with the following:
```
import registerRootComponent from 'expo/build/launch/registerRootComponent';

import index from '../../index';

registerRootComponent(index);
```
2. Install the dependencies:
```
npm install
```
4. Start the running with a simulator
```
npm run ios
```
