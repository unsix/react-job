import React from "react"
import Logo from '../../component/logo/logo'
import { List,Button, InputItem,WingBlank, Radio, Flex, WhiteSpace } from 'antd-mobile';
import {connect} from 'react-redux'
import {regisger} from '../../redux/user_redux'
import {Redirect} from 'react-router-dom'
import imoocForm from '../../component/imooc-form/imooc-form'

@connect(
	state=>state.user,
	{regisger}
)
@imoocForm
class Register extends React.Component {
  constructor(props){
    super(props)
    this.handleRegister = this.handleRegister.bind(this)
  }
	componentDidMount(){
	this.props.handleChange('type','genius')
}
  handleRegister(){
    this.props.regisger(this.props.state)

  }
  render(){
    const RadioItem = Radio.RadioItem
    return (
      <div>
				{this.props.redirectTo? <Redirect to={this.props.redirectTo} />:null}
        <Logo></Logo>
        <List>
				{this.props.msg?<p className ="err-msg">{this.props.msg}</p>:null}
        <InputItem
          onChange={v=>this.props.handleChange('user',v)}
        >用户名</InputItem>

        <WhiteSpace />
        <InputItem
          type='password'
          onChange={val=>this.props.handleChange('pwd',val)}
        >密码</InputItem>
        <WhiteSpace />
        <InputItem
          type='password'
          onChange={v=>this.props.handleChange('repeatpwd',v)}
        >确认密码</InputItem>
        <WhiteSpace />
        <RadioItem
          checked={this.props.state.type=='genius'}
          onChange={()=>this.props.handleChange('type','genius')}
        >
          牛人
        </RadioItem>
        <RadioItem
          checked={this.props.state.type=='boss'}
          onChange={()=>this.props.handleChange('type','boss')}
        >
          BOSS
        </RadioItem>
        <WhiteSpace />
        <Button type='primary' onClick={this.handleRegister}>注册 </Button>
        </List>
      </div>
    )
  }
}

export default Register
