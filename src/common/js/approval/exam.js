import {getAvatar} from '@/common/js/avatar.js'
export default class exam_list {
  //审批列表
  constructor({approval_id, name,avatar,company_name,add_time,creat_time,type,title,approval_state,approval_state_num,participation_id,tagging}) {
    this.approval_id = approval_id
    this.name = name
    this.avatar = avatar
    this.company_name = company_name
    this.add_time = add_time
    this.creat_time = creat_time
    this.type = type
    this.title = title
    this.approval_state = approval_state
    this.participation_id = participation_id
    this.tagging = tagging
    this.approval_state_num = approval_state_num
  }
}
//获取时间
function get_data(time){
	return `${time.slice(0,4)}年${time.slice(5,7)}月${time.slice(8,10)}日
	${time.slice(11)}`
}
function get_data1(time){
	if(!time){
		return
	}
	return `${time.slice(0,4)}年${time.slice(5,7)}月${time.slice(8,10)}日
	${time.slice(11)}`
}
export function create_exam_list(item) {
  return new exam_list({
    approval_id: item.approval_id,
    name: item.name,
    avatar:getAvatar(item.avatar),
    company_name:item.company_name,
    add_time:get_data(item.add_time),
    creat_time:get_data1(item.creat_time),
    type:get_type(item.type),
    title:item.title,
    approval_state:get_state(item.approval_state),
    participation_id:item.participation_id,
    approval_state_num:item.approval_state,
    tagging:getColor(item)
  })
}
//标记颜色
function getColor(item){
	if(!item.tagging){
		return
	}
	if(item.tagging === 'FF0000' ||item.tagging === '#FF0000'){
		return 'rgba(255,0,0,0.1)'
	}else if(item.tagging === '#FFF000'||item.tagging === 'FFF000'){
		return 'rgba(255,255,0,0.1)'
	}else if(item.tagging === '#00FF00'||item.tagging === '00FF00'){
		return 'rgba(0,255,0,0.1)'
	}else if(item.tagging === '#0000FF'||item.tagging === '0000FF'){
		return 'rgba(0,0,255,0.1)'
	}

}
//获取状态
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
//获取类型
function get_type(type){
	if(type === '0'){
		return '请款单'
	}else if(type === '1'){
		return '合同评审表'
	}else if(type === '2'){
		return '合同评审表'
	}else if(type === '3'){
		return '请购单'
	}else if(type === '5'){
		return '申请公章'
	}else if(type === '6'){
		return '呈批件'
	}else if(type === '7'){
		return '请购单'
	}else if(type === '8'){
		return '请款单'
	}else if(type === '9'){
		return '请款单'
	}else if(type === '111'){
		return '合同评审表'
	}else if(type === '10'){
		return '请购单'
	} else if(type === '11'){
    return '报销单'
  }

}
