export default function aspect(type, fn, fn2) {
    return function(target, name, descriptor) {
        type = type.toLowerCase();
        let f = (function(currentMethod) {
            let c = currentMethod;
            switch (type) {
                //环绕
                case 'around':
                    return function() {
                        fn.apply(this, arguments);
                        c.apply(this, arguments);
                        fn2.apply(this, arguments);
                    }
                    break;
                //在主逻辑前执行
                case 'before':
                    return function() {
                        fn.apply(this, arguments);
                        c.apply(this, arguments);
                    }
                    break;
                //在主逻辑后执行
                case 'after':
                    return function() {
                        c.apply(this, arguments);
                        fn.apply(this, arguments);
                    }
                    break;
            }
        })(descriptor.value);
        descriptor.value = f;
        return descriptor;
    }
}