import React from "react"
import Logo from '../../component/logo/logo'
import { List,Button, InputItem,WingBlank, Radio, Flex, WhiteSpace } from 'antd-mobile';
class Register extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      type:'boss'
    }
  }
  render(){
    const RadioItem = Radio.RadioItem
    return (
      <div>
        <Logo></Logo>
        <List>
          <InputItem>用户名</InputItem>
          <WhiteSpace />
          <InputItem>密码</InputItem>
          <WhiteSpace />
          <InputItem>确认密码</InputItem>
          <WhiteSpace />
          <RadioItem checked ={this.state.type == 'boss'}>
            老版
          </RadioItem>
          <RadioItem checked ={this.state.type == 'genius'}>
            牛人
          </RadioItem>
          <WhiteSpace />
          <Button type = 'primary'>
            注册
          </Button>
        </List>
      </div>
    )
  }
}

export default Register
