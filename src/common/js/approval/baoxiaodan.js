export  default class baoxiaodan_list{
  constructor({title,content,many_enclosure,money,big_money,project_manager_name,project_manager}){
    this.title = title
    this.money = money
    this.content=content
    this.big_money=big_money
    this.many_enclosure=many_enclosure
    this.project_manager_name=project_manager_name
    this.project_manager = project_manager
  }
}
export function create_baoxiaodan_list(item) {
  return new baoxiaodan_list({
    title:item.title,
    money: item.money,
    content:item.content,
    big_money:item.big_money,
    many_enclosure:item.many_enclosure,
    project_manager_name:get_manager_name(item),
    project_manager:item.project_manager
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
