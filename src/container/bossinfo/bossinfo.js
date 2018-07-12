import React from 'react'
import { NavBar, Icon ,InputItem,TextareaItem} from 'antd-mobile';
import AvatarSelector from '../../component/avatar-selector/avatar-selector'
class BossInfo extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      title:''
    }
  }
  onChange(key,val) {
    this.setState({
      [key] : val
    })
  }
  render() {
    return (
      <div>
        <NavBar
          mode="dark"
          leftContent="Back"
          rightContent={[
            // <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
            // <Icon key="1" type="ellipsis" />,
          ]}
      >BOSS完善信息页</NavBar>
      <AvatarSelector></AvatarSelector>
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

      </div>)
  }
}


export default BossInfo
