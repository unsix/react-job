import React from 'react'
import {List,InputItem} from 'antd-mobile'
import io from 'socket.io-client'
import {connect} from 'react-redux'
import {getMsgList, sendMsg, recvMsg} from '../../redux/chat_redux'
const socket = io('ws://localhost:9093')

@connect(
	state=>state,
	{ getMsgList, sendMsg, recvMsg}
)
class Chat extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            text : '',
            msg:[]
        }
    }
    componentDidMount(){
        // socket.on('recvmsg',(data)=>{
        //     console.log(data)
        //     this.setState({
        //         msg:[...this.state.msg,data.text]
        //     })
        // })
        this.props.getMsgList()
        this.props.recvMsg()
    }
    handleSubmit(){
        // socket.emit('sendmsg',{text:this.state.text}
        const from = this.props.user._id
        const to = this.props.match.params.user //url地址
        const msg = this.state.text
        this.props.sendMsg({from,to,msg})
        this.setState({
            text:''
        })
    }
    render(){
        console.log(this.props)
        return (
            <div>
                {this.props.chat.chatmsg.map(v=>{
                    return <p key={v._id}>{v.content}</p>
                })}
             <div className='stick-footer' >
                <List>
                    <InputItem
                        placeholder='请输入'
                        value={this.state.text}
                        onChange={v=>{
                            this.setState({text:v})
                        }}
                        extra = {<span onClick = {()=>this.handleSubmit()} >发送</span>}
                    >
                    </InputItem>
                </List>
            </div>   
            </div>
            
        )
    }
}
export default Chat