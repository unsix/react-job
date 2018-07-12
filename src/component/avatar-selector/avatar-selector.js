import React from 'react'
import { Grid } from 'antd-mobile';

class AvatarSelector extends React.Component{

  render() {
    const avatarList = 'boy,girl,man,woman,bull,chick,crab,hedgehog,hippopotamus,koala,lemur,pig,tiger,whale,zebra'
                        .split(",")
                        .map(v=>({
                          icon:require(`../img/${v}.png`),
                          text:v
                        }))
    return (
      <div>
        <Grid data={avatarList} columnNum={5} />
        头像选择
      </div>)
  }
}


export default AvatarSelector
