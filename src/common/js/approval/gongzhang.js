export default class gongzhang_list {
  constructor({department_name,user_name,info,project_manager_name,many_enclosure}) {
    this.department_name = department_name
    this.user_name = user_name
    this.info = info
    this.project_manager_name = project_manager_name
    this.many_enclosure = many_enclosure
  }
}
export function create_gongzhang_list(item) {
  console.log(item)
	return new gongzhang_list({
    department_name: item.department_name,
    user_name: item.user_name,
    info: get_info(item.info),
    project_manager_name:get_manager_name(item),
    many_enclosure:item. many_enclosure
	})
}

function get_info(info){
	info.forEach((item)=>{
		if(item.seal_type){
			switch (item.seal_type)
				{
				case '1':
				  item.seal_type = '公章'
				  break;
				case '2':
				  item.seal_type = '法人章'
				  break;
				case '3':
				  item.seal_type = '财务章'
				  break;
				case '4':
				  item.seal_type = '发票章'
				  break
				case '5':
				  item.seal_type = '合同章'
				  break
				}
		}
	})
	return info
}
function get_manager_name(item){
	if(!item.project_manager_name){
		return '  '
	}
	if(item.project_manager_name.name){
		return item.project_manager_name.name
	}
}
