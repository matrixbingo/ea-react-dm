/**
 *
 * 组件的双向绑定用，修改对应path的数据，继承可选
 * 例：a.b.c修改model a的b.c值
 */
export default class Action {
    static setValueByReducers(valueLink, val){
        (!valueLink || !val) && window.console.error('Action valueLink or val is undifened', valueLink, val)
        valueLink = valueLink.match(/\.(.+?)$/, valueLink)[1]
        return this.update(valueLink, val)
    }
}

