export default class hetongpingshen_list {
  constructor({company_id,approval_id,contract_name_new,contract_name,contract_num,project_manager,a_name,b_name,executor,project_manager_name,prive,contract_temp_id,enclosure_id,total_prive,difference,pay_method,arrive_time,end_time,remarks,many_enclosure,content}) {
    this.contract_name = contract_name
    this.contract_num = contract_num
    this.a_name = a_name
    this.b_name = b_name
    this.project_manager_name = project_manager_name
    this.executor = executor
    this.prive = prive
    this.total_prive = total_prive
    this.difference = difference
    this.pay_method = pay_method
    this.arrive_time = arrive_time
    this.end_time = end_time
    this.remarks = remarks
    this.many_enclosure = many_enclosure,
    this.enclosure_id = enclosure_id
    this.contract_name_new = contract_name_new
    this.contract_temp_id = contract_temp_id
    this.content = content
    this.project_manager = project_manager
    this.approval_id = approval_id
    this.company_id = company_id
  }
}
export function create_hetongpingshen_list(item) {
	return new hetongpingshen_list({
	    contract_name: item.contract_name,
	    contract_num: item.contract_num,
	    a_name: item.a_name,
	    b_name:item.b_name,
	    project_manager_name:get_manager_name(item),
	    executor:item.executor,
	    prive:item.prive,
	    total_prive:item.total_prive,
	    difference:item.difference,
	    pay_method:item.pay_method,
	    arrive_time:item.arrive_time,
	    end_time: item.end_time,
	    remarks:item.remarks,
	    contract_temp_id:item.contract_temp_id,
	    many_enclosure:item.many_enclosure,
	    contract_name_new:item.contract_name_new,
      content:item.content,
      enclosure_id:item.enclosure_id,
      project_manager:item.project_manager,
      company_id:item.company_id,
      approval_id:item.approval_id
	})
}
function get_manager_name(item){
	if(!item.project_manager_name){
		return ' '
	}
	if(item.project_manager_name.name){
		return item.project_manager_name.name
	}
}
