
export default class personal_list{
  constructor({add_time,approval_enclosure,approval_personal_id,approval_state,found_id,handler_uid,is_del,opinion,title,type,type_id,name}){
    this.add_time = add_time
    this.approval_personal_id = approval_personal_id
    this.approval_state = approval_state
    this.is_del = is_del
    this.title = title
    this.type = type
    this.type_id = type_id
    this.approval_enclosure = approval_enclosure
    this.found_id = found_id
    this.handler_uid= handler_uid
    this.opinion= opinion
    this.name = name
  }
}
function get_data(time){
  return `${time.slice(0,4)}年${time.slice(5,7)}月${time.slice(8,10)}日
	${time.slice(11)}`
}
function get_state(state){
  if(state === '0'){
    return '<span style="color:#409EFF">审批中<i class="el-icon-loading" style="margin-left:4px"></i></span>'
  }else if(state === '1'){
    return '<span style="color:#67C23A">已通过<i class="el-icon-success" style="margin-left:4px"></i></span>'
  }else if(state === '2'){
    return '<span style="color:#EB9E05">未通过<i class="el-icon-warning" style="margin-left:4px"></i></span>'
  }else if(state === '3'){
    return '<span style="color:#FA5555">已撤销<i class="el-icon-error" style="margin-left:4px"></i></span>'
  }
}
function get_type(type){
  if(type === '1'){
    return '请购单'
  }else if(type == '2'){
    return '请款单'
  }else if(type == '3'){
    return '呈批件'
  }else if(type == '4'){
    return '报销单'
  }
}
export function create_personal_list(item) {
  return new personal_list({
    add_time:get_data(item.add_time),
    approval_personal_id:item.approval_personal_id,
    approval_state:get_state(item.approval_state),
    is_del:item.is_del,
    title:item.title,
    type:get_type(item.type),
    type_id:item.type_id,
    approval_enclosure:item.approval_enclosure,
    found_id:item.found_id,
    handler_uid:item.handler_uid,
    opinion:item.opinion,
    name:item.name
  })
}

