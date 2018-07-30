import React from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import { Card, WingBlank, WhiteSpace } from 'antd-mobile'
import {getUserList} from '../../redux/chatuser_redux'

@connect (
  state=>state.chatuser,
  {getUserList}
)

class Boss extends React.Component{
  componentDidMount(){
    this.props.getUserList('genius')
  }
  render(){
    const Header = Card.Header
    const Body = Card.Body
    console.log(this.state)
    return(
      <WingBlank>
			<WhiteSpace></WhiteSpace>
		    {
          this.props.userlist.map(v=>(
            v.avatar?(
            <Card key={v._id}>
              <Header
                title={v.user}
                thumb={require(`../img/${v.avatar}.png`)}
                extra={<span>{v.title}</span>}
              >
              </Header>
              <Body>
                {v.desc.split('\n').map(v=>(
                  <div key={v}>{v}</div>
                ))}
              </Body>
            </Card>
          ):null
          ))
        }
        <WhiteSpace></WhiteSpace>
        <WhiteSpace></WhiteSpace>
        <WhiteSpace></WhiteSpace>
        <WhiteSpace></WhiteSpace>
        <WhiteSpace></WhiteSpace>
        <WhiteSpace></WhiteSpace>
        <WhiteSpace></WhiteSpace>
			</WingBlank>
    )
  }

}

export default Boss
