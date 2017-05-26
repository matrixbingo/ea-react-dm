'use strict';

exports.__esModule = true;
exports.Model = Model;
exports.getActionTypes = getActionTypes;
exports.getModels = getModels;
exports.emptyModels = emptyModels;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gfsReactReduxTwowayBinding = require('gfs-react-redux-twoway-binding');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

/**
 * 实体、数据模型，model中的方法和属性都该设置成静态类型
 * @class Model
 * */
//需要一个队列保存model
var __gfs_mvc_m_list = {};
var __gfs_mvc_m_actiontypes = {};

var DEFAULT_METHOD_FIX = '$$';
exports.DEFAULT_METHOD_FIX = DEFAULT_METHOD_FIX;
var DEFAULT = 'default';

exports.DEFAULT = DEFAULT;
function getField(data, path) {
    var newpath = path.concat();
    window.console.log('getField', path);
    try {
        for (var i = 0, len = newpath.length, p, v; i < len; i++) {

            //如果path不是最后一个
            if (i != len) {
                p = newpath.slice(0, i + 1);
                v = data.getIn(p);
                if (!v) {
                    var _Immutable$fromJS;

                    data = typeof v == 'undefined' ? data.mergeIn(p.slice(0, p.length - 1), _immutable2['default'].fromJS((_Immutable$fromJS = {}, _Immutable$fromJS[p[p.length - 1]] = {}, _Immutable$fromJS))) : data.setIn(p, {});
                }
            }
        }
    } catch (ex) {
        window.console && window.console.warn && window.console.warn(ex);
    }

    return data;
}

var curl = {
    del: function del(data, action) {
        return data.deleteIn(action.path);
    },
    update: function update(data, action) {
        data = getField(data, action.path);
        if (typeof action.data === 'string' && action.path) {
            return data.setIn(action.path, action.data);
        }
        action.data = _immutable2['default'].fromJS(action.data);
        return action.path ? data.mergeIn(action.path, action.data) : data.merge(action.data);
    },
    add: function add(data, action) {
        data = getField(data, action.path);
        return data.setIn(action.path, action.isImmutable ? _immutable2['default'].fromJS(action.data) : action.data);
    },
    query: function query(data) {
        return data;
    },
    find: function find(data, action) {
        return data.getIn(action.path);
    }
};

function implement() {
    var target = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var modelName = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
    var param = arguments.length <= 2 || arguments[2] === undefined ? { property: {}, method: {} } : arguments[2];
    var fix = arguments.length <= 3 || arguments[3] === undefined ? '' : arguments[3];

    var property = param.property;
    var method = param.method;

    if (fix) {
        fix += DEFAULT_METHOD_FIX;
    }
    for (var item in target) {
        if (!(target[item] instanceof Function)) {
            property[item] = target[item];
        } else {
            method['' + fix + modelName + DEFAULT_METHOD_FIX + item] = target[item].bind(target);
            //__gfs_mvc_m_actiontypes[`${fix}${modelName}${DEFAULT_METHOD_FIX}${item}`] = `${fix}${modelName}${DEFAULT_METHOD_FIX}}${item}`
        }
    }

    return {
        property: property,
        method: method
    };
}

/**
 * 一个类装饰器，被装饰的类会变成store，默认不需要额外提供对数据操作的方法，在control中默认会提供del、update、add等数据操作方法；如果有特殊需求无法满足使用场景可按照example中给出的方式自行编写数据处理方法<br />
 * <strong style="color:red">注意：model类中`__name`属性必须要有，这是为了能在各个component正常使用model必备的一个属性,必须小写，默认会在字符串后面添加上"model",例如：`static __name='test'`,那么在实际中运用应该是this.props.testmodel</strong>
 * @method Model
 * @param target {object} 被包装的对象
 * @example
 *
 *       import {Model} from 'gfs-react-mvc'
 *       //这里由于@为文档关键符号，所以下面将以$代替
 *       //@Model
 *       $Model
 class TestModel {
            //__name必须要有，这是为了能再各个component正常使用model必备的一个属性,必须小写
            static __name = 'testmodel'
            //数据模型
            static age = 20
            static xq = {}
            //可以自行定义数据操作方法，在control中通过
            //dispatch({
            //    type:`testmodel$$save`,
            //    data:data
            //})
            //这种方式变更数据，其中type值的组成是通过：类名（全小写）+ 方法名组成
            static save(data, action){
                if(action.data){
                    return data.merge(Immutable.fromJS(action.data) )
                }
            }
            //dispatch({
            //    type:`testmodel$$del`,
            //    data:data
            //})
            static del(data, action){
                if(action.data){
                    return data.merge(Immutable.fromJS(action.data) )
                }
            }
        }
 * */

function Model(target) {
    var params = {};
    //读取字段组成新的对象
    if (typeof target.__name == 'undefined' && typeof target.name == 'undefined') {
        window.console && window.console.warn('[create model error] ', 'Model中必须存在__name属性，并赋予store名称，例如: static __name="testmodel"');
        return {
            modelName: '',
            store: null
        };
    }
    var modelName = target.name.toLowerCase() || target.__name.toLowerCase();

    if (modelName.indexOf('model') <= -1) {
        modelName += 'model';
    }

    //取得属性或方法
    params = implement(target, modelName);
    params = implement(curl, modelName, params, DEFAULT);

    var store = _gfsReactReduxTwowayBinding.createReducer(modelName, _immutable2['default'].fromJS(params.property || {}), params.method);

    __gfs_mvc_m_list['' + modelName] = store;

    return {
        modelName: modelName,
        store: store
    };
}

function getActionTypes(typeName) {
    return __gfs_mvc_m_actiontypes[typeName];
}

function getModels() {
    return __gfs_mvc_m_list;
}

function emptyModels() {
    __gfs_mvc_m_list = null;
}