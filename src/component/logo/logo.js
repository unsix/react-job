import React from "react"
// import logoImg from './job.png'
import './logo.css'
class Logo extends React.Component {

  render(){
    return(
      <div className="logo-container">
        {/* <img src={logoImg} alt="" /> */}
        <img src={require('./job.png')} alt="" />
      </div>
    )
  }
}

export default Logo
