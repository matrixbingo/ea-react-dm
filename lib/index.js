'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.page = page;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

//export {binding} from './valuelink'

var _extend = require('extend');

var _extend2 = _interopRequireDefault(_extend);

var _gfsReactTools = require('gfs-react-tools');

var _gfsReactTools2 = _interopRequireDefault(_gfsReactTools);

var _model = require('./model');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

/**
 * 提供Model、View、Control、Sync、RTools等系列便捷类库
 * @module gfs-react-mvc
 * */

/**
 * 页面渲染
 * @class Page
 * */

/**
 *
 * @method page
 * @param opts {object} 可以直接等于react component
 * @param opts.middleware {array} 可选，中间件集合
 * @param opts.module {react component} 必填，需要渲染在页面的组件
 * @param opts.devTools {object} 可选，数据模型调试，可视化面板，可以查看数据模型结构
 * @param opts.bar {object} 可选，异步数据请求时加载状态栏
 * @param opts.agent {string} 可选，默认值为pc，三种可选值：pc、wap、other，other已bar字段对象为准
 * @param opts.container {string} 可选，默认为root，组件放在页面的容器id
 * @return RTools
 * @example
 *
 *      imoprt {page} from 'gfs-react-mvc'
 *      import Module from './TestComponent'
 *
 *      //渲染到页面
 *      page(Module)
 * */
Object.defineProperty(exports, 'Model', {
    enumerable: true,
    get: function get() {
        return _model.Model;
    }
});

var _control = require('./control');

Object.defineProperty(exports, 'Control', {
    enumerable: true,
    get: function get() {
        return _control.Control;
    }
});
Object.defineProperty(exports, 'Sync', {
    enumerable: true,
    get: function get() {
        return _control.Sync;
    }
});
Object.defineProperty(exports, 'fetch', {
    enumerable: true,
    get: function get() {
        return _control.fetch;
    }
});

var _view = require('./view');

Object.defineProperty(exports, 'View', {
    enumerable: true,
    get: function get() {
        return _view.View;
    }
});

function page() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    if (opts && typeof opts.module === 'undefined') {
        opts = {
            module: opts
        };
    }

    opts.middleware = [_reduxThunk2['default']].concat(opts.middleware || []);

    if (opts.debug || location.port != '') {
        opts.middleware.push(require('redux-logger')());
    }

    var rtools = new _gfsReactTools2['default']((0, _extend2['default'])({
        //可选
        middleware: [],
        //必填
        module: null,
        //可选
        reducers: (0, _model.getModels)(),
        //可选n
        //devTools:DevTools,
        //可选 默认loadingbarComponent
        //bar:null,
        //可选  loadingbar平台（pc/wap/other）other直接使用bar字段作为参数
        //agent:'pc',
        //可选  react component放取的节点id
        container: 'root',
        debug: false
    }, opts));

    (0, _model.emptyModels)();

    return rtools;
}