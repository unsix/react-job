export default class cengpijian_list {
  constructor({title, department_name,chengpi_num,content,project_manager_name,img_list}) {
    this.title = title
    this.department_name = department_name
    this.chengpi_num = chengpi_num
    this.content = content
    this.project_manager_name = project_manager_name
    this.img_list = img_list
  }
}
export function create_cengpijian_list(item) {
	return new cengpijian_list({
	    title: item.title,
	    department_name: item.department_name,
	    chengpi_num: item.chengpi_num,
	    content:item.content,
	    project_manager_name:item. project_manager_name.name,
	    img_list:img_id(item)
	})
}

function img_id(item){
	if(item.contract_id.type === 3){
		return item.contract_id.contract_id
	}
}
