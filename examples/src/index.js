import {Model,Control,Sync,View,page} from '../../src/index.js'
import Action from '../../src/base/Action'
import Immutable from 'immutable'
import Hello from './demo/Hello'

new Hello().show()

@Model
class TestModel {
    //static __name = 'test'
    static age = 20
    static xq = null
    static a ={
        b : 12
    }
    static temp = {}

    constructor(){

    }
}

class TestAction{
    constructor(){}
    showTest(){
        console.dir('testaction')
    }
}
let action = new TestAction()


@Control(TestModel)
class TestControl extends Action{
    //Object.defineProperty(target, key, descriptor);
    @Sync('/test.json',{
        error:(err)=>{
            console.dir(err)
        }
    })
    static saveTest(data,c){
        //this.getChange()('age', 10)
        return this.update('age','ajax改变的age：'+data.age)

        /*data.age = 'ajax改变的age：'+data.age
        action.showTest()
        return {
            type:'save',
            data:data
        }*/
    }
    static insertTest(path,data){
          return this.add(path,data)
    }
}


import React, { Component /*,PropTypes*/} from 'react'


@View(TestControl)
class TestComponent extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount(){
        setTimeout(()=>{
            this.props.saveTest(this)
            this.props.insertTest('xq.test.name','insert-xiaomin')
        },1000)

    }

    static defaultProps={}

    click(){
        this.props.setValueByReducers('TestModel.temp', {})
        window.console.log(1111)
    }

    render() {
        console.log('age:',this.props.testmodel.get('temp') )
        console.log('age:',this.props.testmodel.get('age') )
        console.log('a.b', this.props.testmodel.get('a').get('b'))
        return (
            <div>
                <span style={{color:'red'}} onClick={this.click.bind(this)}>
                    {this.props.testmodel.getIn(['xq','test','name'])}
                </span>
            </div>
        )
    }
}

page(TestComponent)

