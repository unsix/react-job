import React from 'react'
import {TabBar} from 'antd-mobile'
class NavLinkBar extends React.Component{

  render(){
    const navList = this.props.data.filter(v=>!v.hide)
    console.log(navList)
    return(
      <TabBar>
        {navList.map(v=(
          <TabBar.Item
            key={v.path}
            title={v.text}
            icon={}
          >

          </TabBar.Item>
        ))}
      </TabBar>
    )
  }
}

export default NavLinkBar
