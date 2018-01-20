export  default class baoxiaodan_list{
  constructor({title,content,many_enclosure,money,project_manager_name}){
    this.title = title
    this.money = money
    this.content=content
    this.many_enclosure=many_enclosure
    this.project_manager_name=project_manager_name
  }
}
export function create_baoxiaodan_list(item) {
  return new baoxiaodan_list({
    title:item.title,
    money: item.money,
    content:item.content,
    many_enclosure:item.many_enclosure,
    project_manager_name:get_manager_name(item),
  })
}

function get_manager_name(item){
  if(!item.project_manager_name){
    return '  '
  }
  if(item.project_manager_name.name){
    return item.project_manager_name.name
  }
}
