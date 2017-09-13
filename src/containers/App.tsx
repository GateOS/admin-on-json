import * as React from "react";
import * as type from '../type'
import * as parser from './parser'
import { Route, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

const Menu = (props) =>  <ul>props.children</ul>
const Item = (props) => <li>props.children</li>
const Layout = (props) => <div>props.children</div>
const Sider = (props) => <div>props.children</div>
const Icon = (props) => <div>props.children</div>
const Header = (props) => <div>props.children</div>
const Dropdown = (props) => <div>props.children</div>
const Content = (props) => <div>props.children</div>
const Footer  = (props) => <div>props.children</div>
class App extends React.Component<any, any>{
    state = {
        collapsed: false
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    menuDropdown = () => {
        return (
            <Menu>
                <Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
                </Item>
                <Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
                </Item>
                <Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3d menu item</a>
                </Item>
            </Menu>
        )
    }

    componentDidMount() {
    }
    getSelectItem() {
        let num:any = 0
        // console.log(history.location)
        this.props.menu.children.map((item, index) => {
            if (this.props.pathname == item.to) {
                num = `${index}`
            }
        })
        return `${num}`
    }

    render() {
        let num = this.getSelectItem()
        return (
            <Layout style={{ height: '100vh' }
            }>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                >
                    <Menu
                        defaultSelectedKeys={[num]}
                        mode="inline"
                        style={{ height: '100vh', padding: '15px 0' }}
                    >
                        {this.props.appRouter.map((item, index) => (
                            <Route
                                key={index}
                                path={item.path}
                                exact={true}
                                component={() => <div className="logo"
                                    style={{
                                        padding: '0 15px',
                                        background: '#f8f8f8',
                                        borderRadius: '6px',
                                        margin: '0 15px 15px',
                                        textAlign: 'center'
                                    }}
                                >{item.content.config.name}</div>}
                            />
                        ))}
                        {this.props.menu.children.map((item, index) => {
                            switch (item.type) {
                                case 'Link':
                                    return <Item key={index}><Link to={{ pathname: (item as type.Link).to }}><Icon type={item.iconType} /><span>{item.label}</span></Link></Item>
                            }
                        })}
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                            style={{ padding: '0 16px', fontSize: '24px', verticalAlign: 'middle' }}
                        />
                        <Menu
                            mode="horizontal"
                        >
                            <Item key="1">
                                <Dropdown overlay={this.menuDropdown()}>
                                    <Link className="ant-dropdown-link" to="">
                                        <Icon type="user" /><span>Hover me</span><Icon type="down" />
                                    </Link>
                                </Dropdown>
                            </Item>
                            <Item key="2">
                                <Dropdown overlay={this.menuDropdown()}>
                                    <Link className="ant-dropdown-link" to="">
                                        <Icon type="user" /><span>Hover me</span><Icon type="down" />
                                    </Link>
                                </Dropdown>
                            </Item>
                        </Menu>
                    </Header>
                    <Content style={{ padding: '15px' }}>
                        {this.props.children}
                    </Content>
                    <Footer style={{ textAlign: 'center', background: '#fff', padding: '15px' }}>
                        skong Admin  © 2017
                    </Footer>
                </Layout>
            </Layout >
        )
    }
}

// export default connect(state => state)(App);
// 获取到当前 redux 的 state
export default connect(state => state.router)(App)
