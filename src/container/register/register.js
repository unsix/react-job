import React from "react"
import Logo from '../../component/logo/logo'
import { List,Button, InputItem,WingBlank, Radio, Flex, WhiteSpace } from 'antd-mobile';
import {connect} from 'react-redux'
import {regisger} from '../../redux/user_redux'

@connect(
	state=>state.user,
	{regisger}
)

class Register extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      type:'genius',
      user:'',
      pwd:'',
      repeatpwd:'',

    }
    this.handleRegister = this.handleRegister.bind(this)
  }
  handleChange(key,val){
    this.setState(
      {[key]:val}
    )
  }
  handleRegister(){
    this.props.regisger(this.state)

  }
  render(){
    const RadioItem = Radio.RadioItem
    return (
      <div>
        <Logo></Logo>
        <List>
				{this.props.msg?<p className ="err-msg">{this.props.msg}</p>:null}
        <InputItem
          onChange={v=>this.handleChange('user',v)}
        >用户名</InputItem>

        <WhiteSpace />
        <InputItem
          type='password'
          onChange={val=>this.handleChange('pwd',val)}
        >密码</InputItem>
        <WhiteSpace />
        <InputItem
          type='password'
          onChange={v=>this.handleChange('repeatpwd',v)}
        >确认密码</InputItem>
        <WhiteSpace />
        <RadioItem
          checked={this.state.type=='genius'}
          onChange={()=>this.handleChange('type','genius')}
        >
          牛人
        </RadioItem>
        <RadioItem
          checked={this.state.type=='boss'}
          onChange={()=>this.handleChange('type','boss')}
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
