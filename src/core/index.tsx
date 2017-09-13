// 引入 ts 类型定义
import * as type from '../type'

// 引入 react 全家桶
import * as React from "react";
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { routeReducer } from 'redux-simple-router'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'
import { BrowserRouter as Router, Route, Link, IndexRoute } from 'react-router-dom'


// 引入 History 用来设置 react 路由的 URL 类型
import createHistory from 'history/createBrowserHistory'

// 引入 json 解析模块
import * as ppor from './preprocessor'
// 引入jquery
import * as $ from 'jquery'




import Login from '../containers/Login'
import App from '../containers/App'

// 递归处理 json
import * as parser from '../containers/parser'

const validate = function (nextState, replaceState, callback) {
    // 需要做权限控制的时候开启
    // const isLoggedIn = !!store.getState().auth.authenticated
    // if (!isLoggedIn) {
    //   replaceState(null, '/login')
    // }
    callback()
}

// 引入当前项目组件
import * as containers from '../containers'

// export function parseConfig(adminConfig: type.Config): Array<type.ParsedItem> {
//     return
// }

// 在 ../index.tsx 中调用此方法，传入完整 json 串
export function render(config: type.Config) {

    // 对 json 进行（依赖、父子关系、去除首尾空格）等处理
    config = ppor.resolve(config)

    // 取出 json 配置中所有的 router 以及对应的 component
    // var parsedItems = config.content.map((config) => {
    //     return containers.parser.parse(config)
    // });

    // 将 config 中 router 下面的 content json 串渲染成组件
    config.router.map((item, index) => {
        config.router[index].content = containers.parser.parse(item.content)
    });

    console.log(config.router)

    // 创建 history（这种情况下使用浏览器历史记录）
    const history = createHistory()

    // 构建拦截和调度导航操作的，将history中接受到的变化反应到state中去
    // history ＋ store（redux）--> react－router－redux --> 加强版history -->react－router
    const middleware = routerMiddleware(history)

    // 定义redux  reducers
    var reducers = {};
    reducers['router'] = function (state = {}, action: any) {
        if (action.type === "@@router/LOCATION_CHANGE") {
            return action.payload
        } else {
            return state;
        }
    }

    // 获取项目中所有子组件内的 reducer， 并拼到同一个 reducer 中
    var _reducers = parser.getReducers();
    for (var key in _reducers) {
        reducers[key] = _reducers[key]
    }

    // react-router-redux 相关配置
    var reducer = combineReducers(reducers) as any
    var finalCreateStore: any = compose(
        applyMiddleware(thunk, middleware, createLogger())
    )(createStore);
    var configureStore = function (initialState) {
        return finalCreateStore(reducer, initialState,
            (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());
    };

    // 定义 redux store
    var store = configureStore({
        router: {}
    })

    parser.regstore("store", finalCreateStore)

    /**
     * react-router-redux 文档
     * https://github.com/ReactTraining/react-router/tree/master/packages/react-router-redux
     * https://reacttraining.com/react-router/web/example/sidebar
     */

    // 生成 路由
    ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <div>
                    {config.router.map((item, index) => (
                        < Route
                            key={index}
                            exact
                            path={item.path}
                            render={() => {
                                return (
                                    <App style={{ height: '100vh' }} menu={config.menu} appRouter={config.router}>
                                        <div className="" style={{ background: '#fff', padding: '15px' }}>
                                            {<item.content.container />}
                                        </div>
                                    </App>
                                )
                            }}
                        />
                    ))}
                </div>
            </ConnectedRouter>
        </Provider>, document.getElementById('root'));
}


/* <div>
                    {parsedItems.map((item, index) => (
                        < Route
                            key={index}
                            exact
                            path={item.config.router.path}
                            render={() => {
                                return (
                                    <App style={{ height: '100vh' }} menu={config.menu} parsedItems={parsedItems}>
                                        <div className="" style={{ background: '#fff', padding: '15px' }}>
                                            {<item.container />}
                                        </div>
                                    </App>
                                )
                            }}
                        />
                    ))}
                    <Route path="/login" component={Login} /> */

