import * as React from "react";
import * as type from '../type'
import * as parser from './parser'
export default function Todo(config: type.Component): type.ParsedItem {
    return {
        config: config,
        container: () => <div>NotFound</div>
    }
}


parser.register('Todo',Todo)
