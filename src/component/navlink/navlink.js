import React from 'react'

class NavLinkBar extends React.Component{

  render(){
    const navList = this.props.data.filter(v=>!v.hide)
    console.log(navList)
    return(
      <div>dasd</div>
    )
  }
}

export default NavLinkBar
