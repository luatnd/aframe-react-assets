var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class,
    _temp2,
    _jsxFileName = 'src/components/Assets.jsx';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';

var defaultTimeout = 30000;
var defaultInterval = 200;

/**
 * NOTE: <a-assets> must be a child of a <a-scene>.
 * So that I create this component to manage all assets
 */
var Assets = (_temp2 = _class = function (_React$Component) {
  _inherits(Assets, _React$Component);

  function Assets() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, Assets);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Assets.__proto__ || Object.getPrototypeOf(Assets)).call.apply(_ref, [this].concat(args))), _this), _this.assetsInstance = null, _this.total = 0, _this.current = 0, _this.idleTimestamp = 0, _this.countLoadedAssetItem = function (e) {
      //console.log('countLoadedAssetItem this.current: ', this.current, e, e.target);

      _this.current++;
      _this.assetCurrentItem = e.target;

      if (_this.props.debug && e.target) {
        console.info('[Assets] loaded: ', e.target);
      }

      var currentUnix = Assets.getCurrUnixMili();
      var _this$props$interval = _this.props.interval,
          interval = _this$props$interval === undefined ? defaultInterval : _this$props$interval;

      if (currentUnix - interval > _this.idleTimestamp) {
        _this.idleTimestamp = currentUnix;

        if (_this.props.debug) {
          ConsoleLogger.log('Attempt to updateAssetsLoadingInfo', 'Assets');
        }

        _this.props.loadingInfoHandle({
          assetLoaded: _this.current,
          assetTotal: _this.total,
          assetCurrentItem: _this.assetCurrentItem
        });
      }
    }, _this.updateProgress = function (e) {
      //console.log('xhr: ', e);

      var currentUnix = Assets.getCurrUnixMili();
      var _this$props$interval2 = _this.props.interval,
          interval = _this$props$interval2 === undefined ? defaultInterval : _this$props$interval2;

      if (currentUnix - interval > _this.idleTimestamp) {
        _this.idleTimestamp = currentUnix;
        _this.props.currentInfoHandle({
          assetCurrentLoadedBytes: e.detail.loadedBytes,
          assetCurrentTotalBytes: e.detail.totalBytes ? e.detail.totalBytes : e.detail.loadedBytes
        });
      }
    }, _this.getBindingProps = function (item) {

      var eventName = void 0;

      switch (item.type) {
        case 'a-asset-item':
          eventName = 'loaded'; // aframe / threejs event
          return {
            // NOTE: This case is an react component, not a pure HTML so that we need to pass eventListener to `ref`
            ref: function ref(ele) {
              ele.addEventListener(eventName, _this.countLoadedAssetItem);
              //ele.addEventListener('progress', this.updateProgress);
            }
          };

        case 'img':
          eventName = 'onLoad'; // js event
          return _defineProperty({}, eventName, _this.countLoadedAssetItem);

        case 'audio':
        case 'video':
          eventName = 'onLoadeddata'; // js event
          //eventName = 'loadeddata'; // aframe event
          return _defineProperty({}, eventName, _this.countLoadedAssetItem);

        default:
          console.warn('Un-recognize asset type: ', item.type);
          return {};
      }
    }, _this.getAssetsList = function () {
      var _this$props$assets = _this.props.assets,
          assets = _this$props$assets === undefined ? [] : _this$props$assets;


      var assetItemComponents = Object.keys(assets).map(function (key) {
        var componentAssets = _this.props.assets[key];
        _this.total += componentAssets.length;

        return React.createElement(
          'a-entity',
          { key: key, __source: {
              fileName: _jsxFileName,
              lineNumber: 213
            },
            __self: _this2
          },
          componentAssets.map(function (item) {
            return React.cloneElement(item, _extends({
              key: item.props.id ? item.props.id : ConsoleLogger.getUnix()
            }, _this.getBindingProps(item)) // Bind event listener for this elements
            );
          })
        );
      });

      if (_this.props.debug) {
        console.log('Component list to add assets: ', assetItemComponents);
      }

      return assetItemComponents;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Assets, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      // Because we bind event to element so that do not re-render this component
      return false;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      ConsoleLogger.log('Assets Component mounted', 'Assets');
      //console.log('assetsInstance.fileLoader: ', this.assetsInstance.fileLoader);
      //if (this.assetsInstance.fileLoader) {
      //  const mng = this.assetsInstance.fileLoader.manager;
      //
      //  mng.onError = function (a, b) {
      //    console.log("mng onError a, b: ", a, b);
      //  }
      //  mng.onLoad = function (a, b) {
      //    console.log("mng onLoad a, b: ", a, b);
      //  }
      //  mng.onProgress = function (a, b) {
      //    console.log("mng onProgress a, b: ", a, b);
      //  }
      //  mng.onStart = function (a, b) {
      //    console.log("mng onStart a, b: ", a, b);
      //  }
      //}

      this.assetsInstance.addEventListener('loaded', function () {
        // Force too complete
        _this3.props.loadingInfoHandle({
          assetLoaded: _this3.total,
          assetTotal: _this3.total,
          assetCurrentItem: _this3.assetCurrentItem
        });
        setTimeout(_this3.props.loadingStatusHandle(false), 1000);

        ConsoleLogger.log('All assets were loaded', 'Assets');
        //console.info('And THREE.Cache', THREE.Cache);
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // Make sure to remove the DOM listener when the component is unmounted.
      //this.nv.removeEventListener("nv-enter", this.handleNvEnter);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props$timeout = this.props.timeout,
          timeout = _props$timeout === undefined ? defaultTimeout : _props$timeout;


      return React.createElement(
        'a-assets',
        Object.assign({ timeout: timeout }, { ref: function ref(ele) {
            return _this4.assetsInstance = ele;
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 236
          },
          __self: this
        }),
        this.getAssetsList()
      );
    }
  }], [{
    key: 'getCurrUnixMili',
    value: function getCurrUnixMili() {
      return new Date().getTime();
    }

    /**
     * Try to Attach "loaded" event listener foreach asset items.
     * "loaded" event name was different from each item
     *
     * @param item React element, eg: <img src=""/>
     * @returns {*}
     */


    // TODO: Support asset management with lazy load

  }]);

  return Assets;
}(React.Component), _class.propTypes = {
  /**
   * Asset list
   */
  assets: PropTypes.object,

  /**
   * Stop loading assets and run the app when this value was reached, in milliseconds.
   * @default 30000
   */
  timeout: PropTypes.number,

  /**
   * The interval duration in milliseconds that this component will do update via props *Handle() bellow
   * Example: loadingInfoHandle() will be run each 200ms (default)
   *
   * @default 200
   */
  interval: PropTypes.number,

  /**
   * Turn on console.log this component activities
   */
  debug: PropTypes.bool,

  /**
   * loadingStatusHandle(status:boolean): A event handle callback: Was called with
   *    status=true when <assets/> was start loading,
   *    status=false when all assets was loaded
   */
  loadingStatusHandle: PropTypes.func,

  /**
   * currentInfoHandle({assetCurrentLoadedBytes, assetTotalBytes})
   * assetCurrentLoadedBytes
   * assetTotalBytes
   * You can calculate current progress by percent: const currentPercent = assetCurrentLoadedBytes / assetTotalBytes * 100;
   *
   * NOTE: TODO: This feature has not completed yet;
   */
  currentInfoHandle: PropTypes.func,

  /**
   * loadingInfoHandle({assetLoaded, assetTotal, assetCurrentItem})
   * Update loading info every `interval` milliseconds
   *  assetLoaded: Number of successfully loaded assets,
   *  assetTotal: Total amount of all your assets,
   *  assetCurrentItem: The current loaded assets, value is the html element
   */
  loadingInfoHandle: PropTypes.func
}, _temp2);
export { Assets as default };

var ConsoleLogger = function () {
  function ConsoleLogger() {
    _classCallCheck(this, ConsoleLogger);
  }

  _createClass(ConsoleLogger, null, [{
    key: 'getLocaleTimeStr',
    value: function getLocaleTimeStr() {
      var d = new Date();
      var h = d.getHours();
      var m = d.getMinutes();
      var s = d.getSeconds();
      var ms = d.getMilliseconds();

      return h + ':' + m + ':' + s + '-' + ms;
    }
  }, {
    key: 'getUnix',
    value: function getUnix() {
      return Math.floor(new Date().getTime() / 1e3);
    }
  }, {
    key: 'log',
    value: function log(msg) {
      var componentName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

      console.log('[' + componentName + '] ' + msg + ' at ' + this.getLocaleTimeStr());
    }
  }]);

  return ConsoleLogger;
}();