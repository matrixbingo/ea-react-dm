import Immutable from 'immutable'
import {MaskBar, LoadingBar} from 'gfs-loadingbar'
import RTools from 'gfs-react-tools'
import {fetch} from '../control'
import _ from 'underscore'

/**
 *
 * 组件的双向绑定用，修改对应path的数据，继承可选
 * 例：a.b.c修改model a的b.c值
 */
class BaseControl {
    static setValueByReducers(valueLink, val) {
        (!valueLink || !val) && window.console.error('Action valueLink or val is undifened', valueLink, val)
        const isEmptyObject = function (e) {
            var t
            for (t in e)
                return !1
            return !0
        }
        valueLink = valueLink.match(/\.(.+?)$/, valueLink)[1]
        if (isEmptyObject(val)) {
            return this.save(valueLink, Immutable.fromJS(val))
        }
        return this.save(valueLink, Immutable.fromJS(val))
    }
}

const ajax = {
    /**
     * 组合请求参数
     * @param {b:1,c:2}
     * @returns ?b=1&c=2
     */
    initParams: function (data) {
        if (!data || _.isEmpty(data)) {
            return ''
        }
        var arr = []
        for (var item in data) {
            arr.push('&' + item + '=')
            arr.push(data[item])
        }
        if (arr.length == 0) {
            return ''
        }
        var str = arr.join('')
        return '?' + str.substring(1, str.length)
    },
    fetch: function (connect, type, url, param, valueLink, _this, callBack) {
        let _data = {
            method: type,
            timeout: 60000
        }

        if (type.toLowerCase() != 'get') {
            _data = {
                body: JSON.stringify(param),
                method: type,
                timeout: 60000,
                header: {
                    'Content-Type': 'application/json'
                }
            }
        }
        return (dispatch) => {
            fetch(url + (type.toLowerCase() == 'get' ? ajax.initParams(param) : ''), _data).then((data) => {
                _this && callBack && callBack(_this, data)
                dispatch(connect.save(valueLink, Immutable.fromJS(data.msg)))
            }, (error) => {
                _this && _this.showMsg && _this.showMsg('error', 'URL:' + url + ', 提交失败!!!')
                window.console.error('ajax:' + url + ' error!!', error)
            })
        }
    }
}

function Loading(type, params) {
    return function (target, name, descriptor) {
        type = type.toLowerCase()
        const loadingBar = new LoadingBar()
        const text = (params && params.text) || '加载中...'
        let f = (function (currentMethod) {
            let c = currentMethod
            switch (type) {
                case 'loading':
                    return function () {
                        RTools.addLoadingBar && RTools.addLoadingBar(loadingBar)
                        return c.apply(this, arguments)
                    }
                case 'mosk':
                    return function () {
                        RTools.addLoadingBar && RTools.addLoadingBar(new MaskBar({text: text}))
                        return c.apply(this, arguments)
                    }
                default:
                    return function () {
                        return c.apply(this, arguments)
                    }
            }
        })(descriptor.value)
        descriptor.value = f
        return descriptor
    }
}

export default class Action extends BaseControl {

    static fetch(url, type, param, valueLink, _this, callBack) {
        return ajax.fetch(this, type, url, param, valueLink, _this, callBack)
    }

    @Loading('mosk')
    static fetchMosk(url, type, param, valueLink, _this, callBack) {
        return ajax.fetch(this, type, url, param, valueLink, _this, callBack)
    }

    @Loading('loading')
    static fetchLoading(url, type, param, valueLink, _this, callBack) {
        return ajax.fetch(this, type, url, param, valueLink, _this, callBack)
    }

    @Loading('mosk')
    static ajaxGetMosk(url, param, valueLink, _this, callBack) {
        return ajax.fetch(this, 'GET', url, param, valueLink, _this, callBack)
    }

    @Loading('loading')
    static ajaxGet(url, param, valueLink, _this, callBack) {
        return ajax.fetch(this, 'GET', url, param, valueLink, _this, callBack)
    }

    @Loading('mosk')
    static ajaxPostMosk(url, param, valueLink, _this, callBack) {
        return ajax.fetch(this, 'POST', url, param, valueLink, _this, callBack)
    }

    @Loading('loading')
    static ajaxPost(url, param, valueLink, _this, callBack) {
        return ajax.fetch(this, 'POST', url, param, valueLink, _this, callBack)
    }
}

