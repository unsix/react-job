import React from 'react'
import ReactDom from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { BrowserRouter, Route,Switch } from 'react-router-dom'


import Login from './container/login/login'
import Register from './container/register/register'
import AuthRoute from './component/authroute/authroute'
import reducers from './reducers'
import './config'
import './index.css'


const store = createStore(reducers, compose(
	applyMiddleware(thunk),
	window.devToolsExtension?window.devToolsExtension():f=>f
))

// boss genius me msg 4个页面
ReactDom.render(
	(<Provider store={store}>
		<BrowserRouter>
			<div>
					<AuthRoute></AuthRoute>
					<Switch>
						<Route path='/login' component={Login}></Route>
						<Route path='/register' component={Register}></Route>
					</Switch>
			</div>
		</BrowserRouter>
	</Provider>),
	document.getElementById('root')
)
