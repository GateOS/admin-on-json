import * as React from "react";
import { Link } from 'react-router-dom';
import * as type from '../type'
import RestClient from "../rest/RestClient";
import { connect } from 'react-redux'
import * as $ from 'jquery'

import { bindActionCreators } from 'redux'

import * as parser from './parser'



export default function DataTable(config: type.DataTable): type.ParsedItem {

    var name = parser.getSign(config, '_parent', 'name')

    var getFetchActionName = function () {
        return name + '_FETCH';
    }
    var getFetchDoneActionName = function () {
        return name + '_FETCH_DONE';
    }
    var getSearchActionName = function () {
        return name + '_FETCH_SEARCH';
    }
    var getDeleteActionName = function () {
        return name + '_DELETE';
    }
    var getDeleteDoneActionName = function () {
        return name + '_DELETE_DONE';
    }


    var actions: any = {};
    actions[getFetchActionName()] = function () {
        return function (dispatch, getState) {
            var client = new RestClient();
            $.get(config.api, (res) => {
                res = eval('(' + res + ')')
                dispatch({
                    type: getFetchDoneActionName(),
                    rows: res.rows.map((item) => {
                        return {
                            ...item,
                            key: item.id
                        }
                    })
                })
            });
        }
    }
    actions[getSearchActionName()] = function (value) {
        return function (dispatch, getState) {
            var client = new RestClient();
            $.get(config.api, value, (res) => {
                res = eval('(' + res + ')')
                dispatch({
                    type: getFetchDoneActionName(),
                    rows: res.rows.map((item) => {
                        return {
                            ...item,
                            key: item.id
                        }
                    })
                })
            })
        }
    }
    actions[getDeleteActionName()] = function (id) {
        return function (dispatch, getState) {
            var client = new RestClient();
            client.delete(config.api + '/' + id, (res) => {
                // if (config.prompting) {
                //     message.success(config.prompting.success);
                // } else {
                //     confirm
                //     message.success(config._prompting.success);
                // }
                dispatch({
                    type: getDeleteDoneActionName(),
                    id: id
                })
            });
        }
    }

    var reducer = function (state = {
        list: [],
        dialogState: {}
    }, action: any) {
        switch (action.type) {
            case getFetchDoneActionName():
                return {
                    ...state,
                    list: action.rows
                }
            case getDeleteDoneActionName():
                return {
                    ...state,
                    list: state.list.filter(function (item) {
                        return item.id !== action.id
                    }),
                }
            default:
                return state;
        }
    }

    class DataTable extends React.Component<any, any>{

        state = {
            ModalText: '',
            visible: false,
            confirmLoading: null,
            id: null,
            isDelete: true
        }

        componentDidMount() {
            if (config.prompting) {
                this.setState({
                    isDelete: false,
                    ModalText: config.prompting.confirm
                })
            }
            this.props.actions[getFetchActionName()]()
        }

        rowSelection() {
            return {
                onChange: (selectedRowKeys, selectedRows) => {
                },
                onSelect: (record, selected, selectedRows) => {
                },
                onSelectAll: (selected, selectedRows, changeRows) => {
                },
            };
        }

        handleDelBtnClick(id?:any) {
            return () => {
                if (config.prompting) {
                    if (this.state.visible == true) {
                        this.setState({
                            visible: false,
                            ModalText: config.prompting.loading,
                            confirmLoading: true,
                        }, () => {
                            this.props.actions[getDeleteActionName()](this.state.id);
                        })
                    } else {
                        this.setState({
                            isDelete: true,
                            visible: true,
                            id: id
                        })
                    }
                } else {
                    this.props.actions[getDeleteActionName()](this.state.id);
                }
            }
        }
        onChange(value) {
            let search = value
        }

        filter() {
            const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
            const Filter = config.filter.map((item) => {
                // switch (item.type) {
                //     case "Input":
                //         return (
                //             <FormItem key={Math.random()}>
                //                 {getFieldDecorator(item.name, {
                //                     rules: [{ required: false }]
                //                 })(
                //                     <Input placeholder={item.placeholder} />
                //                     )}
                //             </FormItem>

                //         )
                //     case "TimePicker":
                //         return (


                //             <FormItem key={Math.random()}>
                //                 {getFieldDecorator(item.name)(<RangePicker placeholder={item.labelName} />)}
                //             </FormItem>
                //         )
                //     case "Select":
                //         return (
                //             <FormItem key={Math.random()}>
                //                 {getFieldDecorator(item.name)(<Cascader options={item.data} placeholder={item.labelName} />)}
                //             </FormItem>
                //         )
                //     case "InputNumber":
                //         return (
                //             <FormItem key={Math.random()}>
                //                 {getFieldDecorator(item.name)(<InputNumber placeholder={item.labelName} />)}
                //             </FormItem>
                //         )
                //     case "QueryButton":
                //         return (
                //             <FormItem key={Math.random()}>
                //                 <Button htmlType="submit" >{item.label}</Button>
                //             </FormItem>
                //         )
                //     case "AddButton":
                //         return (
                //             <FormItem key={Math.random()}>
                //                 <Link to={{ pathname: config._router.path + '/add' }}><Button >{item.label}</Button></Link>
                //             </FormItem>
                //         )
                //     case "ReturnButton":
                //         return (
                //             <FormItem key={Math.random()}>
                //                 <Button >{item.label}</Button>
                //             </FormItem>
                //         )
                // }
            })
            return Filter
        }

        showModal(id) {
            return () => {
                this.setState({
                    visible: true,
                    id: id
                });
            }
        }

        handleCancel = () => {
            this.setState({
                visible: false,
            });
        }
        listColumns() {
            const columns = config.columns.map((item) => {
                if (item.type == "Controller") {
                    return {
                        title: item.label,
                        dataIndex: item.name,
                        key: item.name,
                        render: (elementItem) => (<div>
                            {/* {(item.children as Array<type.Component>).map((btn) => {
                                switch (btn.type) {
                                    case 'EditButton':
                                        return (
                                            <Link to={{ pathname: config._router.path + '/edit/' + elementItem.id }} key={btn.label} >
                                                <Button size="large" key={btn.label} >{btn.label}</Button>
                                            </Link>
                                        );
                                    case 'DeleteButton':
                                        return <Button size="large" key={btn.label} onClick={this.handleDelBtnClick(elementItem.id)} >{btn.label}</Button>
                                    case 'DesignButton':
                                        return <Button size="large" key={btn.label} onClick={this.handleDelBtnClick(elementItem.id)} >{btn.label}</Button>
                                    case 'GenerationButton':
                                        return <Button size="large" key={btn.label} onClick={this.handleDelBtnClick(elementItem.id)} >{btn.label}</Button>
                                }
                            })
                            } */}
                        </div>)
                    }
                } else {
                    return {
                        title: item.label,
                        dataIndex: item.name,
                        key: item.name
                    }
                }

            })
            return columns;
        }

        isModal() {
            const { visible, confirmLoading, ModalText } = this.state;
            // if (config.prompting) {
            //     return (
            //         <Modal title="系统提示"
            //             visible={visible}
            //             onOk={this.handleDelBtnClick()}
            //             confirmLoading={confirmLoading}
            //             onCancel={this.handleCancel}
            //         >
            //             <p>{ModalText}</p>
            //         </Modal>
            //     )
            // }
        }
        handleSubmit = (e) => {
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    console.log(values)
                    console.log('Received values of form: ', values);
                    this.props.actions[getSearchActionName()](values)
                }
            });
        }
        render() {
            const { list } = this.props;
            const { getFieldDecorator } = this.props.form;
            return (
                <div>
                    {/* <Form layout="inline" className="filter" onSubmit={this.handleSubmit}>
                        {config.filter.map((item, index) => {
                            item.name = `${item.name}`
                            switch (item.type) {
                                case "Input":
                                    return (
                                        <FormItem key={index}>
                                            {getFieldDecorator(item.name, {
                                                rules: [{ required: false }]
                                            })(
                                                <Input placeholder={item.placeholder} />
                                                )}
                                        </FormItem>

                                    )
                                case "TimePicker":
                                    return (
                                        <FormItem key={index}>
                                            {getFieldDecorator(item.name)(<RangePicker placeholder={item.labelName} />)}
                                        </FormItem>
                                    )
                                case "Select":
                                    return (
                                        <FormItem key={index}>
                                            {getFieldDecorator(item.name)(<Cascader options={item.data} placeholder={item.labelName} />)}
                                        </FormItem>
                                    )
                                case "InputNumber":
                                    return (
                                        <FormItem key={index}>
                                            {getFieldDecorator(item.name)(<InputNumber placeholder={item.labelName} />)}
                                        </FormItem>
                                    )
                                case "QueryButton":
                                    return (
                                        <FormItem key={index}>
                                            <Button htmlType="submit" >{item.label}</Button>
                                        </FormItem>
                                    )
                                case "AddButton":
                                    return (
                                        <FormItem key={index}>
                                            <Link to={{ pathname: config._router.path + '/add' }}><Button >{item.label}</Button></Link>
                                        </FormItem>
                                    )
                                case "ReturnButton":
                                    return (
                                        <FormItem key={index}>
                                            <Button >{item.label}</Button>
                                        </FormItem>
                                    )
                            }
                        })}
                    </Form>
                    <Table rowSelection={this.rowSelection()} columns={this.listColumns()} dataSource={list} style={{ marginTop: '15px' }} />
                    {this.isModal()} */}
                </div>
            )
        }
    }

    var mapStateToProps = function (state) {
        return state[name];
    };

    var mapDispatchToProps = function (dispatch) {
        return {
            actions: bindActionCreators(actions, dispatch)
        };
    }
    parser.addReducer(name, reducer)

    return {
        route: config.route,
        config: config,
        actions: actions,
        container: connect(mapStateToProps, mapDispatchToProps)
    }

}


parser.register('DataTable', DataTable)
