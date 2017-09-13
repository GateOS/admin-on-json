// 解析 json 文件生成 react 路由
import * as core from './core';

// 引入 ts 类型定义
import * as type from './type';

// 引入 css 主题文件
import './themes/default'

// 引入解析 json 模块
import * as ppor from './core/preprocessor'

// 使用 ppor 方法请求获取 json 配置并解析，传入 core 中生成 react 路由
ppor.getConfigFromWebDirectory('./assets/example1', (res) => {
    console.log(res)
    core.render(res)
})
// ppor.getConfigFromWebDirectory('/assets/saul', (res) => {
//     console.log(res)
//     core.render(res)
// })
