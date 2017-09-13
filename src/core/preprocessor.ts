import * as type from '../type';
import * as $ from 'jquery'

/**遍历json */
// 给每个 key 增加 _parent _router 字段，方面获取父级元素信息
function traverse(o, func) {
    for (let i in o) {
        if (i !== '_parent' && i !== '_router' && i !== '_prompting') {
            func.apply(this, [i, o[i], o]);
            if (o[i] !== null && typeof (o[i]) == "object") {
                //going one step down in the object tree!!
                traverse(o[i], func);
            }
        }
    }
}

/**设置父子依赖 */
// 给每个 key 增加 _router 字段，方面获取父级元素信息
function addRouterRef(key, value, obj) {
    if (typeof value === 'object') {
        if (obj.router) {
            value._router = obj.router;
        } else {
            value._router = obj._router;
        }
    }
}

/**设置父子依赖 */
// 给每个 key 增加 _parent 字段，方面获取父级元素信息
function addParentRef(key, value, obj) {
    if (typeof value === 'object') {
        value._parent = obj;
    }
}
/**设置父子依赖 */
// 给每个 key 增加 _parent 字段，方面获取父级元素信息
function addPromptingRef(key, value, obj) {
    if (typeof value === 'object') {
        if (obj.env && obj.env.prompting) {
            value._prompting = obj.env.prompting;
        } else if (obj.prompting) {
            value._prompting = obj.prompting;
        } else {
            value._prompting = obj._prompting;
        }
    }
}

/**消除字符串遍历 */
function resovleString(key, value, obj) {
    if (typeof value === 'string') {
        obj[key] = value.replace(/(\$\{([^\$\`]*)\})/g, function (...args) {
            var result = getEnvVal(obj, args[2]);
            result = result.replace(/(\$\{\`([^\$]*)\})/g, function (...args) {
                return '${' + args[2] + '}'
            });
            return result;
        })
    }
}

/**消除高级字符串遍历 */
function resovleAdvString(key, value, obj) {
    if (typeof value === 'string') {
        obj[key] = value.replace(/(\$\{([^\$\`]*)\})/g, function (...args) {
            var result = getEnvVal({ env: obj }, args[2]);
            return result;
        })
    }
}

/**获取环境变量 */
function getEnvVal(obj, name): string {
    if (obj) {
        if (obj.env && obj.env[name]) {
            return obj.env[name];
        } else {
            return getEnvVal(obj._parent, name)
        }
    }
}

/**变量求值 */
export function resolve(config: type.Config): type.Config {

    traverse(config, addRouterRef);
    traverse(config, addParentRef);
    traverse(config, addPromptingRef);
    traverse(config, resovleString);
    traverse(config, resovleAdvString);

    return config;
}

// 通过 ajax 获取 json 信息，并合并为一个完整的 json 文件
// 默认配置 menu router 等信息
export function getConfigFromWebDirectory(dir, callback) {
    let file = {
        scopeFile: dir + '/_scope.json',
        menuFile: dir + '/menu.json',
        routerFile: dir + '/router.json'
    }
    let num = 3
    var datas = {};
    datas['dir'] = dir
    datas['content'] = []
    for (let n in file) {
        $.get(file[n], (res) => {
            num--
            if (n == 'menuFile') {
                let menu = {
                    name: 'menu',
                    type: 'Menu',
                    children: res
                }
                datas['menu'] = menu
            }
            if (n == 'scopeFile') {
                datas['env'] = res
            }
            if (n == 'routerFile') {
                // 通过 router.js 获取对应的 component
                datas['router'] = res;
                num += res.length
                let _router = clone(res)
                for (let i = 0; i < res.length; i++) {
                    $.get(dir + res[i].component + '.json', (ress) => {
                        num--
                        ress['router'] = _router[i]
                        datas['router'][i]['content'] = ress
                        if (num == 0) {
                            callback(datas)
                        }
                    })
                }
            }
        })
    }
}

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        let copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        let copy = [];
        for (let i = 0; i < obj.length; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        let copy = {};
        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
