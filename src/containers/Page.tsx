import * as React from "react";
import * as type from '../type'
import * as parser from './parser'
import RestClient from "../rest/RestClient";
import { Link } from 'react-router-dom';

export default function Page(config: type.Page): type.ParsedItem {
    
    let headers;
    let contents;
    let footers;

    // 生成 headers
    if (config.header) {
        // 遍历当前页面的 header
        footers = config.footer.map((item) => {
            // 将当前 json 配置传入 parser 中获取子组件
            var Container = parser.parse(item).container
            return <Container key={Math.random()} />;
        })
    } else {
        headers = config.children
    }
    
    // 生成 contents
    if (config.content) {
        // 遍历当前页面的 contents
        contents = config.content.map((item) => {
            // 将当前 json 配置传入 parser 中获取子组件
            var Container = parser.parse(item).container
            return <Container key={Math.random()} />;
        })
    } else {
        contents = config.children
    }
    
    // 生成 footers
    if (config.footer) {
        // 遍历当前页面的 footers
        footers = config.footer.map((item) => {
            // 将当前 json 配置传入 parser 中获取子组件
            var Container = parser.parse(item).container
            return <Container key={Math.random()} />;
        })
    } else {
        footers = config.children
    }

    return {
        config: config,
        container: () => <div key={Math.random()}>
            {headers}
            {contents}
            {footers}
        </div>
    }
}

// 注册 Page 组件，在 parser.parse() 中会使用到 
parser.register('Page', Page)
