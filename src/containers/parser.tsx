var _creaters = {};

// 获取组件的 type 信息，并判断是否在当前项目中定义了此类型组件（在子组件中定义），并进行创建组件
// 想要获取当前项目中的组件，需要在子组件中定义
// 列：DataForm.tsx 中使用 parser.register('DataForm', DataForm) 定义
export function parse(config): any {
    var creater = _creaters[config.type];
    if (creater) {
        // json 中 type 存在执行 type 方法，返回一个新的组件
        return creater(config)
    } else {
        console.error(config.content.type + ' NotFound')
        return (_creaters as any).Todo(config)
    }
}

// 注册 store ，供其他组件中使用
var _store = {};
export function regstore(name, creater) {
    _store[name] = creater
}

// 获取 store
export function getstore() {
    return _store;
}

export function getSign(option, target, search) {
    if (option instanceof Object) {
        return getSignObj(option, target, search)
    } else if (option instanceof Array) {
        return getSignAry(option, target, search)
    }
}

function getSignAry(option, target, search) {
    option.map((item) => {
        if (item[search]) {
            return option[search]
        }
    })
}
function getSignObj(option, target, search) {
    if (option[search]) {
        return option[search]
    } else {
        if (option[target] instanceof Object) {
            return getSignObj(option[target], target, search)
        } else if (option[target] instanceof Array) {
            return getSignAry(option[target], target, search)
        }
    }
}

// 注册组件
export function register(name, creater) {
    _creaters[name] = creater
}

// 获取 creaters
export function getCreaters() {
    return _creaters;
}

// 注册 reducers 
// 作用：将子组件中的 reducers 存起来 ，以便入口文件（index.tsx）中拼接完整 reducers 使用
var _reducers = {};
export function addReducer(key, r) {
    _reducers[key] = r;
}

// 获取 reducers 
// 作用：入口文件（index.tsx）中获取所有的 reducers
export function getReducers() {
    return _reducers;
}
