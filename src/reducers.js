// 合并所有reducer 并且返回
import { combineReducers } from 'redux'
import { user } from './redux/user_redux'
import { chatuser } from './redux/chatuser_redux'
import { chat } from './redux/chat_redux'
export default combineReducers({user,chatuser,chat})
