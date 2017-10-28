### What | Why
A React component for smart managing your AFrame VR assets. You can declare your assets at your React component.

#####The problem

> Aframe require you too put all your assets inside `<a-assets>` and a direct child of `<a-scene>`


**Reality**

```html
<a-scene>
     <!-- Aframe Asset management system. -->
    <a-assets>
        <a-asset-item id="horse-obj" src="horse.obj"></a-asset-item>
        <a-asset-item id="horse-mtl" src="horse.mtl"></a-asset-item>
        <a-mixin id="giant" scale="5 5 5"></a-mixin>
        <audio id="neigh" src="neigh.mp3"></audio>
        <img id="advertisement" src="ad.png">
        <video id="kentucky-derby" src="derby.mp4"></video>
    </a-assets>

    <a-entity class="camera" camera=""></a-entity>
    
    <Entity>
        <Sky/>
        <Light/>
        <FloorAndWall/>
        
        <Entity className="advertise">
            <a-plane src="#advertisement"></a-plane>
            <a-sound src="#neigh"></a-sound>
            <a-entity geometry="primitive: plane" material="src: #kentucky-derby"></a-entity>
            <a-entity mixin="giant" obj-model="obj: #horse-obj; mtl: #horse-mtl"></a-entity>
        </Entity>
        
    </Entity>
</a-scene>
```

So if you create Aframe with React, you need to divide your Aframe HTML into some small component.
```html
<Entity className="advertise">
    <a-plane src="#advertisement"></a-plane>
    <a-sound src="#neigh"></a-sound>
    <a-entity geometry="primitive: plane" material="src: #kentucky-derby"></a-entity>
    <a-entity mixin="giant" obj-model="obj: #horse-obj; mtl: #horse-mtl"></a-entity>
</Entity>
``` 
into this:
```html
<Advertise/>
```

How can you manage your asset now and avoid violate to [The problem](#the-problem) mentioned above.
Use this plugin help you put your asset at your component and avoid conflict with [The problem](#the-problem).

### How
0.. Install plugin
```shell
yarn install aframe-react-assets
```

1.. Declare your `static Assets` array at your component:

```jsx harmony
import imgSky from "assets/img/sky.jpg";
import videoMilkyWay from "assets/img/videoMilkyWay.mp4";

export default class Sky extends React.Component {
  static Assets = [
    <img id="sky" src={imgSky} alt="sky"/>,
    <video id="videoMilkyWay" src={videoMilkyWay}/>
  ];
  
  render() {
    return (
      <Entity {...this.props}>
        <a-sky className="sky" src="#sky" rotation="0 0 0"/>
      </Entity>
    );
  }
}
```

2.. Create an `rootAssets.js` like this:
rootAssets.js
```jsx harmony
export default {
  // [ComponentName:string]: Your declared Assets array
  Sky:          require('../Sky/Sky').default.Assets,
  FloorAndWall: require('../FloorAndWall/FloorAndWall').default.Assets,
  Workspace:    require('../Workspace/Workspace').default.Assets,
  BackWall:     require('../Decorator/BackWall').default.Assets,
  FrontSea:     require('../Decorator/FrontSea').default.Assets,
  Center:       require('../Decorator/Center').default.Assets,
  Light:        require('../Light/Light').default.Assets,
};
```

3.. Use `Assets`:
MyScene.jsx:
```jsx harmony
import {Entity, Scene} from 'aframe-react';
import Assets from 'aframe-react-assets';
import rootAssets from 'path/to/rootAssets.js';

export default class MyScene extends React.Component {
  render () {
    return <Scene>
      {/* Use assets here */}
      <Assets 
        assets={rootAssets}
        timeout={4e4}
        interval={200}
        debug={true}
        currentInfoHandle={this.updateAssetsCurrentInfo}
        loadingInfoHandle={this.updateAssetsLoadingInfo}
        loadingStatusHandle={this.updateAssetsLoadingStatus}
      />
             
      <Entity camera="userHeight: 2; fov: 80;"/>
      <Entity>
         <Sky/>
         <Light/>  
         <FloorAndWall/>
         <Workspace/>

         <Entity className="decorator">
           <BackWall/>
           <FrontSea/>
           <Center/>
         </Entity>
         
       </Entity>
     </Scene>
  }
}
```
### Assets Props

##### assets: object
* See `rootAssets.js` above 

##### timeout: number
* Stop loading assets and run the app when this value was reached, in milliseconds.
* @default 30000

##### interval: number
 * The interval duration in milliseconds that this component will do update via props *Handle() bellow
 * Example: loadingInfoHandle() will be run each 200ms (default)
 *
 * @default 200
 
##### debug: PropTypes.bool,
 * Turn on console.log this component activities

##### loadingStatusHandle(`status: boolean`): void
 * When <a-assets/> was start loading its assets: `loadingStatusHandle(true)` was triggered.
 * When all assets was loaded or exceed `timeout` props: `loadingStatusHandle(false)` was triggered.
 
##### currentInfoHandle(`{assetCurrentLoadedBytes: number, assetTotalBytes: number}`): void
 * currentInfoHandle was triggered each `interval` milliseconds. See `interval` props.
 * You can calculate current progress by percent: 
    `const currentPercent = assetCurrentLoadedBytes / assetTotalBytes * 100;`
 * NOTE: TODO: This feature has not completed yet;

##### loadingInfoHandle(`{assetLoaded: number, assetTotal: number, assetCurrentItem: object}`):void
 * loadingInfoHandle was triggered each `interval` milliseconds. See `interval` props.
 * Update loading info every `interval` milliseconds
    * `assetLoaded`: Number of successfully loaded assets,
    * `assetTotal`: Total amount of all your assets,
    * `assetCurrentItem`: The current loaded assets, value is the html element
