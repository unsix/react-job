import React, { Component } from 'react'
import { Route,Switch } from 'react-router-dom'
import Login from './container/login/login'
import Register from './container/register/register'
import BossInfo from './container/bossinfo/bossinfo'
import GeniusInfo from './container/geniusinfo/geniusinfo'
import AuthRoute from './component/authroute/authroute'
import DashBoard from './component/dashboard/dashboard'
import Chat from './component/chat/chat'
import UploadImage from './component/upload/upload'
import './index.css'
class App extends Component {
  constructor(props){
    super(props)
    this.state={
      hasError:false
    }
  }
  componentDidCatch(err,info){
    console.log(err,info)
    this.setState({
      hasError:true
    })
  }
  render() {
    return this.state.hasError?
    <img className="logo-error" src={require('./error.jpg')} alt=""></img>:(
      <div>
        <AuthRoute></AuthRoute>
        <Switch>
          <Route path='/bossinfo' component={BossInfo}></Route>
          <Route path='/geniusinfo' component={GeniusInfo}></Route>
          <Route path='/login' component={Login}></Route>
          <Route path='/register' component={Register}></Route>
          <Route path='/chat/:user' component={Chat}></Route>
          <Route path='/upload' component={UploadImage}></Route>
          <Route  component={DashBoard}></Route>
        </Switch>
      </div>
    )
  }
}

export default App
