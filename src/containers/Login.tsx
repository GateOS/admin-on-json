import * as React from "react";
import * as type from '../type'
import * as parser from './parser'

export default class Login extends React.Component<any, any>{
    render() {
        return (
            <div className="form">
                <div className="logo">
                    <img alt={'logo'} src="" />
                    <span>1212</span>
                </div>
                <form>
                    {/* <FormItem hasFeedback>
                        <Input size="large" onPressEnter="" placeholder="Username" />
                    </FormItem>
                    <FormItem hasFeedback>
                        <Input size="large" type="password" onPressEnter="" placeholder="Password" />
                    </FormItem>
                    <Row>
                        <Button type="primary" size="large" onClick="" loading="">Sign in</Button>
                        <p>
                            <span>Username：guest</span>
                            <span>Password：guest</span>
                        </p>
                    </Row> */}
                </form>
            </div>
        )
    }
}
