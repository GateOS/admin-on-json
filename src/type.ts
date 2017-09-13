export interface Component {
    name?: string,
    label?: string,
    route?: string
    type: string,
    env?: ENV,
    children?: Array<Component> | string,
    _parent?: any,
    _router?: any
}

export interface Link extends Component {
    to: string
}

export interface Menu extends Component {
    children: Array<Link | Menu>
}

export interface Column extends Component { }
export interface DataTable extends Component {
    name: string,
    title: string,
    api: string,
    columns: Array<Column>,
    filter: Array<any>,
    prompting: any,
    _parent?: any,
    _router?: any,
    _prompting?: any
}

export interface FromItem extends Component {
    required?: boolean,
    defaultValue: string,
    placeholder: string
}
export interface DataFrom extends Component {
    title: string,
    api: string,
    items: Array<FromItem>,
    controls: Array<Component>,
    successUrl: string,
    prompting: any,
    _parent?: any,
    _router?: any,
    _prompting?: any
}

export type ENV = {
    [key: string]: string
}

export type ShellItem = Component | DataTable | DataFrom

export type Page = {
    content: any,
    children: any,
    header: any,
    footer: any
}

export type ParsedItem = {
    route?: any,
    config: any,
    actions?: any,
    reducer?: any,
    container: any,
    _parent?: any,
    _router?: any
}


export type Config = {
    env: ENV,
    menu: Menu,
    content: any,
    router: any,
    _parent?: any,
    _router?: any
}
