import Immutable from 'immutable'

/**
 *
 * 组件的双向绑定用，修改对应path的数据，继承可选
 * 例：a.b.c修改model a的b.c值
 */
export default class Action {
    static setValueByReducers(valueLink, val){
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
        return this.update(valueLink, val)
    }
}