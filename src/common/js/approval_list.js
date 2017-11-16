export default class approval_list {
  constructor({found_name, is_ok,list,content}) {
    this.found_name = found_name
    this.is_ok = is_ok
    this.list = list
    this.content = content
  }
}
function is_ok(item){
	if(item = 0){
		return '审批中'
	}else if(item = 1){
		return '已通过'
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
		}
	})
	return item
}
export function create_approval_list(item) {
	console.log(item)
  return new approval_list({
    found_name: item.found_name,
    is_ok: is_ok(item.is_ok),
    list: list(item.list),
    content:content(item.content)
  })
}