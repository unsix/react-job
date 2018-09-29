import React from 'react'
import {connect} from 'react-redux'
import {NavBar} from 'antd-mobile'
import {Route} from 'react-router-dom'
import NavLinkBar from '../navlink/navlink'
import Boss from '../boss/boss'
import Genius from '../genius/genius'
import User from '../user/user'
import Msg from '../msg/msg'
import {getMsgList, recvMsg} from '../../redux/chat_redux'
import QueueAnim from 'rc-queue-anim'
// function Msg(){
//   return <h2>消息列表</h2>
// }


@connect(
	state=>state,
	{getMsgList, recvMsg}
)
class Dashboard extends React.Component{
	componentDidMount(){
		if (!this.props.chat.chatmsg.length){
			this.props.getMsgList()
			this.props.recvMsg()
		}
	}
	render(){
		const {pathname} = this.props.location
		const user = this.props.user
		const navList = [
			{
				path:'/boss',
				text:'牛人',
				icon:'boss',
				title:'牛人列表',
				component:Boss,
				hide:user.type=='genius'
			},
			{
				path:'/genius',
				text:'boss',
				icon:'job',
				title:'BOSS列表',
				component:Genius,
				hide:user.type=='boss'
			},
			{
				path:'/msg',
				text:'消息',
				icon:'msg',
				title:'消息列表',
				component:Msg
			},
			{
				path:'/me',
				text:'我',
				icon:'user',
				title:'个人中心',
				component:User
			}
		]

		//让动画生效，只渲染一个Router，根据当前path决定组件
		const page = navList.find(v=>v.path==pathname)
		// console.log(page)
		return (
			<div>
				<NavBar className='fixd-header' mode='dard'>{navList.find(v=>v.path==pathname).title}</NavBar>
        <div style={{marginTop:45}}>
			<QueueAnim type='scaleX' duration={800} >
			{/* <Switch> */}
				{/* {navList.map(v=>( */}
				<Route key={page.path} path={page.path} component={page.component}></Route>
				{/* ))} */}
			{/* </Switch> */}
			</QueueAnim>
        </div>
				<NavLinkBar data={navList}></NavLinkBar>

			</div>
		)


	}

}

export default Dashboard
