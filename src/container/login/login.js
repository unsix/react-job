import React from "react"
import Logo from '../../component/logo/logo'
import {connect} from 'react-redux'
import {List, InputItem, WingBlank, WhiteSpace, Button} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import {login} from '../../redux/user_redux'
import imoocFrom from '../../component/imooc-form/imooc-form.js'


@connect(
  state=>state.user,
  {login}
)
@imoocFrom
class Login extends React.Component {
  register =()=>{
    // console.log(this.props)
    this.props.history.push('./register')
  }
  handleLogin =()=>{
    this.props.login(this.props.state)
  }
  render(){
    return (
      <div>
      	{this.props.redirectTo&&this.props.redirectTo!='/login'? <Redirect to={this.props.redirectTo} />:null}
        <Logo></Logo>
        {/* <h2>我是登录页</h2> */}
        <WingBlank>
          <List>
          	{this.props.msg?<p className ="err-msg">{this.props.msg}</p>:null}
            <InputItem
              onChange={v=>this.props.handleChange('user',v)}
            >用户名</InputItem>
            <WhiteSpace />
            <InputItem
                type='password'
                onChange={v=>this.props.handleChange('pwd',v)}
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

// class Login extends React.Component{
//   constructor(props){
//     super(props)
//     this.state = {
//       num:1
//     }
//     // this.handleClick = this.handleClick.bind(this)
//   }
//   handleClick =()=>{
//     this.setState({
//       num:this.state.num+1
//     })
//   }
//   render(){
//     return(
//       <div>
//         <p>{this.state.num} </p>
//         <button onClick={this.handleClick}>click</button>
//       </div>
//     )
//   }
// }
// export default Login