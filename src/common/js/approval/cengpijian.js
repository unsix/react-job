export default class cengpijian_list {
  constructor({title, department_name,chengpi_num,content,project_manager_name,many_enclosure,contract_id}) {
    this.title = title
    this.department_name = department_name
    this.chengpi_num = chengpi_num
    this.content = content
    this.project_manager_name = project_manager_name
    this.many_enclosure = many_enclosure
    this.contract_id = contract_id
  }
}
export function create_cengpijian_list(item) {
	console.log(item)
	return new cengpijian_list({
	    title: item.title,
	    department_name: item.department_name,
	    chengpi_num: item.chengpi_num,
	    content:item.content,
	    project_manager_name:get_project_manager_name(item),
	    many_enclosure:item.many_enclosure,
	    contract_id:get_file(item) 
	})
}

function 	get_project_manager_name(item){
	if(item.project_manager_name){
		return  item.project_manager_name.name
	}else{
		return ' '
	}
}

function get_file(list){
	if(!list.contract_id){
		return
	}
}
