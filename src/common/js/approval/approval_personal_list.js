export default class approval_personal_list{
  constructor({approval_state,handle_time,handler_name,opinion,picture_enclosure}){
    this.approval_state = approval_state
    this.handle_time = handle_time
    this.handler_name = handler_name
    this.opinion = opinion
    this.picture_enclosure = picture_enclosure
  }
}
function state(item) {
  if(item == '0'){
    return '未处理'
  }else if(item == '1'){
    return '同意'
  }else if(item == '2'){
    return '拒绝'
  }
}
function time(item) {
  if(item){
    if(item.length>13){
      return item.substring(0,10)
    }else{
      return
    }
  }
}
export function create_approval_personal_list(item) {
  return new approval_personal_list({
    approval_state:state(item.approval_state),
    handle_time:time(item.handle_time),
    handler_name:item.handler_name,
    opinion:item.opinion,
    picture_enclosure:item.picture_enclosure
  })
}
