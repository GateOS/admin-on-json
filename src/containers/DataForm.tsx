// 引入 react 全家桶
import * as React from "react";
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as $ from 'jquery'

// 引入 ts 类型定义
import * as type from '../type'

// 引入 History 用来设置 react 路由的 URL 类型
import createHistory from 'history/createBrowserHistory'
const history = createHistory()

// 引入 react ajax请求方法（此文件需自行维护相关功能）
import RestClient from "../rest/RestClient";

import * as parser from './parser'


export default function DataForm(config: type.DataFrom): type.ParsedItem {

    var name = parser.getSign(config, '_parent', 'name')
    // 创建 redux actions
    var actions: any = {};

    // 使用当前组件name为前缀，定义 actions
    function getAddActionName() {
        return name + '_ADD';
    }
    function getAddDoneActionName() {
        return name + '_ADD_DONE';
    }
    function getEditActionName() {
        return name + '_EDIT';
    }
    function getEditDoneActionName() {
        return name + '_EDIT_DONE';
    }

    // 为 actions 绑定方法，定义更改 redux state 的方法
    actions[getAddActionName()] = function (payload, url) {
        return function (dispatch, getState) {
            var client = new RestClient();
            client.post(config.api, payload, (res) => {
                if (config.prompting) {
                    //message.success(config.prompting.success);
                } else {
                    confirm
                    //message.success(config._prompting.success);
                }

                // 跳转到指定页面
                window.setTimeout(() => {
                    dispatch(push(url))
                }, 1500)

                // 发起 dispatch 更改 redux state
                dispatch({
                    type: getAddDoneActionName(),
                    payload: res.data
                })
            })
        }
    }

    actions[getEditActionName()] = function (payload, url) {
        return function (dispatch, getState) {
            var client = new RestClient();
            var id = window.location.pathname.slice(16, window.location.pathname.length)
            var client = new RestClient();
            payload.id = id
            client.put(config.api + "/" + id, payload, (res) => {
                // 跳转到指定页面
                if (config.prompting) {
                    //message.success(config.prompting.success);
                } else {
                    confirm
                    //message.success(config._prompting.success);
                }
                // 发起 dispatch 更改 redux state
                dispatch({
                    type: getEditDoneActionName(),
                    payload: res.data
                })
                window.setTimeout(() => {
                    dispatch(push(url))
                }, 1500)
            })
        }
    }

    // Store 收到 Action 以后，必须给出一个新的 State，这种 State 的计算过程就叫做 Reducer。
    // Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。
    var reducer = function (state = {
        list: [],
        dialogState: {}
    }, action: any) {
        // 判断 action 返回新的 state
        switch (action.type) {
            case getAddDoneActionName():
                return {
                    ...state,
                    list: state.list.concat(action.payload),
                };
            case getEditDoneActionName():
                return {
                    ...state,
                    list: state.list.concat(action.payload),
                };
            default:
                return state;
        }
    }
    // DataForm 组件，生成最终的页面
    class DataForm extends React.Component<any, any>{

        state = {
            ModalText: '',
            visible: false,
            confirmLoading: null,
            isDelete: true
        }
        componentDidMount() {
            if (config.prompting) {
                this.setState({
                    isDelete: false,
                    ModalText: config.prompting.confirm
                })
            }
        }
        handleSubmit = (e) => {
            if (config.prompting) {
                if (this.state.visible == true) {
                    this.setState({
                        visible: false
                    }, () => {
                        this.ActionStart()
                    })
                } else {
                    this.setState({
                        isDelete: true,
                        visible: true
                    })
                }
            } else {
                this.ActionStart()
            }
            e.preventDefault();
        }

        ActionStart = () => {
            // 提交时的验证
            this.setState({
                ModalText: config.prompting.loading,
                confirmLoading: true,
            });
            this.props.form.validateFields((err, values) => {
                this.setState({
                    visible: false,
                    confirmLoading: false,
                });
                if (!err) {
                    switch (name) {
                        case 'editStructure':
                            this.props.actions[getEditActionName()](values, config.successUrl);
                            break;
                        case 'addStructure':
                            setTimeout(() => {
                                this.props.actions[getAddActionName()](values, config.successUrl);
                            }, 1000);
                            break;
                    }
                }
            })
        }

        listItems() {
            // 生成 form 列表
            const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
            // return config.items.map((item) => {
            //     return <FormItem label={item.label} key={item.label}>
            //         {getFieldDecorator(item.name, { rules: [{ required: item.required }] })(
            //             <Input style={{ width: '80%' }} placeholder={item.placeholder} />
            //         )}
            //     </FormItem>
            // })
        }

        getUrl() {
            // 获取到当前的url，给取消按钮生成返回url
            console.log(config)
            if (config._router.path.indexOf("/structure") == -1) {
                return config._router.path
            } {
                return "/structure"
            }
        }

        listControls() {
            // 生成 提交、取消 按钮dom
            return config.controls.map((item) => {
                // switch (item.type) {
                //     case "CancelButton":
                //         // return <Link to={{ pathname: config._router.path.replace('/add', '') }} key={item.label} >{item.label}</Link>
                //         return <Link to={this.getUrl()} key={item.label}>
                //             <Button>{item.label}</Button>
                //         </Link>
                //     case "SubmitButton":
                //         return <Button key={item.label} type="primary" onClick={this.handleSubmit}>{item.label}</Button>
                // }
            })
        }

        showModal = () => {
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    this.setState({
                        visible: true,
                    });
                }
            })
        }

        handleCancel = () => {
            this.setState({
                visible: false,
            });
        }
        isModal() {
            const { visible, confirmLoading, ModalText } = this.state;
            if (config.prompting) {
                // return (
                //     <Modal title="系统提示"
                //         visible={visible}
                //         onOk={this.handleSubmit}
                //         confirmLoading={confirmLoading}
                //         onCancel={this.handleCancel}
                //     >
                //         <p>{ModalText}</p>
                //     </Modal>
                // )
            }
        }
        render() {
            const { visible, confirmLoading, ModalText } = this.state;
            // return <Form onSubmit={this.handleSubmit} className="skong-manage-dialog">
            //     {this.listItems()}
            //     <FormItem >
            //         {this.listControls()}
            //     </FormItem>
            //     {this.isModal()}
            // </Form>
            return <div>DataForm</div>
        }
    }

    // 获取到当前 redux 的 state
    var mapStateToProps = function (state) {
        return {
            list: state[name]
        };
    };

    // 获取到当前 redux 的 actions、dispatch
    var mapDispatchToProps = function (dispatch) {
        return {
            actions: bindActionCreators(actions, dispatch)
        };
    }

    // 生成当前页面的 reducer 并返回给 入口文件（index.tsx） 合成一个完整的 reducer
    parser.addReducer(name, reducer)

    // 给父级组件返回 当前组件的状态
    return {
        route: config.route,
        config: config,
        actions: actions,

        // 将当前 redux 的 state、actions、dispatch 当做 props 传给 DataForm 组件
        container: connect(mapStateToProps, mapDispatchToProps)
    }
}

// 注册 DataForm 组件，在 parser.parse() 中会使用到 
parser.register('DataForm', DataForm)
