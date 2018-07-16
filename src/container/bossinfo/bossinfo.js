import React from 'react'
import { NavBar, Icon ,InputItem,TextareaItem,Button} from 'antd-mobile';
import AvatarSelector from '../../component/avatar-selector/avatar-selector'
import {connect} from 'react-redux'
import {update} from '../../redux/user_redux'
import {Redirect} from 'react-router-dom'

@connect(
  state=>state.user,
  {update}
)
class BossInfo extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      title:'',
      company:'',
      money:'',
      desc:''
    }
  }
  onChange(key,val) {
    this.setState({
      [key] : val
    })
  }
  render() {
    const path = this.props.location.pathname
    const Redirect = this.props.redirectTo
    return (
      <div>
      {Redirect&&Redirect!==path?<Redirect to={this.props.redirectTo} />:null}
        <NavBar
          mode="dark"
          leftContent="Back"
          rightContent={[
            // <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
            // <Icon key="1" type="ellipsis" />,
          ]}
      >BOSS完善信息页</NavBar>
      <AvatarSelector
        selectAvatar = {(imgname)=>{
          this.setState({
            avatar:imgname
          })
        }}
      >
      </AvatarSelector>
      <InputItem onChange={(v)=>this.onChange('title',v)}>
        招聘职位
      </InputItem>
      <InputItem onChange={(v)=>this.onChange('company',v)}>
        公司名称
      </InputItem>
      <InputItem onChange={(v)=>this.onChange('money',v)}>
        职位薪资
      </InputItem>
      <TextareaItem
        onChange={(v)=>this.onChange('desc',v)}
        rows={3}
        autoHeight
        title='职位要求'
      >

      </TextareaItem>
      <Button type="primary" onClick={()=>{this.props.update(this.state)}}>
        保存
      </Button>
      </div>)
  }
}


export default BossInfo
