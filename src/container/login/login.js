import React from "react"
import Logo from '../../component/logo/logo'
import {connect} from 'react-redux'
import {List, InputItem, WingBlank, WhiteSpace, Button} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import {login} from '../../redux/user_redux'

@connect(
  state=>state.user,
  {login}
)
class Login extends React.Component {
  constructor(props){
    super(props);
    this.register = this.register.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
  }
  register(){
    console.log(this.props)
    this.props.history.push('./register')
  }
  handleChange(key,val){
    this.setState(
      {[key]:val}
    )
  }
  handleLogin(){
    this.props.login(this.state)
  }
  render(){
    return (
      <div>
      	{this.props.redirectTo? <Redirect to={this.props.redirectTo} />:null}
        <Logo></Logo>
        <h2>我是登录页</h2>
        <WingBlank>
          <List>
          	{this.props.msg?<p className ="err-msg">{this.props.msg}</p>:null}
            <InputItem
              onChange={v=>this.handleChange('user',v)}
            >用户名</InputItem>
            <WhiteSpace />
            <InputItem
                onChange={v=>this.handleChange('pwd',v)}
            >密码</InputItem>
          </List>
          <WhiteSpace />
          <Button onClick={this.handleLogin} type="primary">登录</Button>
          <WhiteSpace />
          <Button onClick={this.register} type="primary">注册</Button>
        </WingBlank>
      </div>
    )
  }
}

export default Login
