import {fetch} from '../control'
import Action from 'Action'
import _ from 'underscore'
import LoadingBar from './LoadingBar'

export const ajax = {
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
        return (dispatch) => {
            fetch(url + ajax.initParams(param), {
                method: type,
                timeout: 60000
            }).then((data) => {
                _this && callBack && callBack(_this, data)
                dispatch(connect.update(valueLink, data.msg))
            }, (error) => {
                _this && _this.showMsg && _this.showMsg('error', 'URL:' + url + ', 查询失败!!!')
                window.console.error('ajaxGet : ' + url + ' error!!', error)
            })
        }
    }
}

export default class BaseControl extends Action{
    @LoadingBar('mosk')
    static ajaxGetMosk(url, param, valueLink, _this, callBack) {
        return ajax.fetch(this, 'GET', url, param, valueLink, _this, callBack)
    }

    @LoadingBar('loading')
    static ajaxGet(url, param, valueLink, _this, callBack) {
        return ajax.fetch(this, 'GET', url, param, valueLink, _this, callBack)
    }

    @LoadingBar('mosk')
    static ajaxPostMosk(url, param, valueLink, _this, callBack) {
        return ajax.fetch(this, 'POST', url, param, valueLink, _this, callBack)
    }

    @LoadingBar('loading')
    static ajaxPost(url, param, valueLink, _this, callBack) {
        return ajax.fetch(this, 'POST', url, param, valueLink, _this, callBack)
    }
}