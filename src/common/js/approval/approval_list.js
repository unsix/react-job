
export default class approval_list {
  constructor({found_name, is_ok,list,content,participation_id,finance}) {
    this.found_name = found_name
    this.is_ok = is_ok
    this.list = list
    this.content = content
    this.participation_id = participation_id
    this.finance = finance
  }
}
function is_ok(item){
	if(item = 0){
		return '审批中'
	}else if(item = 1){
		return '<span style="color: #67C23A;">已通过</span>'
	}
}
function list(list){
	let arr=[]
	list.forEach((item)=>{
		arr.push(item.name)
	})
	return arr
}
function content(item){
	item.forEach((list)=>{	
		if(list.is_agree === '1'){
			list.is_agree = '已同意'
		}else if(list.is_agree === '2'){
			list.is_agree = '未同意'
		}
	})
	return item
}
export function create_approval_list(item) {
  return new approval_list({
    found_name: item.found_name,
    is_ok: is_ok(item.is_ok),
    list: list(item.list),
    content:content(item.content),
    participation_id:item.participation_id,
    finance:get_finance(item)
  })
}

function get_finance(item){
	if(!item.finance){
		return
	}else{
		return item.finance
	}
}
