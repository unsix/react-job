export  default class baoxiaodan_list{
  constructor({department_name,baoxiaoren,content,many_enclosure,project_manager_name,enclosure_id}){
    this.department_name=department_name
    this.baoxiaoren = baoxiaoren
    this.content=content
    this.many_enclosure=many_enclosure
    this.project_manager_name=project_manager_name
    this.enclosure_id=enclosure_id
  }
}
export function create_baoxiaodan_list(item) {
  console.log(item)
  return new baoxiaodan_list({
    department_name:item.department_name,
    baoxiaoren:item.baoxiaoren,
    content:item.content,
    many_enclosure:item.many_enclosure,
    project_manager:get_project_manager_name(item),
    enclosure_id:get_file(item)
  })
}

function get_file(list){
  if(!list.contract_id){
    return
  }
}
function 	get_project_manager_name(item){
  if(item.project_manager){
    return  item.project_manager.name
  }else{
    return ' '
  }
}
