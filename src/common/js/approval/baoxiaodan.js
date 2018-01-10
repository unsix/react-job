export  default class baoxiaodan_list{
  constructor({title,department_name,content,amount,month_day,price,remarks,money,many_enclosure,project_manager_name,enclosure_id}){
    this.title=title
    this.department_name=department_name
    this.content=content
    this.amount=amount
    this.month_day=month_day
    this.price=price
    this.remarks=remarks
    this.money=money
    this.many_enclosure=many_enclosure
    this.project_manager_name=project_manager_name
    this.enclosure_id=enclosure_id
  }
}
export function create_baoxiaodan_list(item) {
  console.log(item)
  return new baoxiaodan_list({
    title:item.title,
    department_name:item.department_name,
    content:item.content,
    amount:item.amount,
    month_day:item.month_day,
    price:item.price,
    remarks:item.remarks,
    money:item.money,
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
