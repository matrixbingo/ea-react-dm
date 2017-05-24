import aspect from './aspect'

export default class Hello {
    constructor() {
        this.description = 'Hello world';
    }

    //给show方法添加切入点，可添加多个
    @aspect('after', () => {
        console.log('-------after---------')
    })
    @aspect('before', () => {
        console.log('-------before---------')
    })
    @aspect('before', () => {
        console.log('-------before 2---------')
    })
    show() {
        //do something
        alert(this.description);
        console.log('current method exec');
    }
}