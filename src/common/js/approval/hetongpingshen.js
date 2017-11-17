export default class hetongpingshen_list {
  constructor({contract_name,contract_num,a_name,b_name,executor,project_manager_name,prive,total_prive,difference,pay_method,arrive_time,remarks,enclosure_id}) {
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
    this.remarks = remarks
    this.enclosure_id = enclosure_id
  }
}
export function create_hetongpingshen_list(item) {
	return new hetongpingshen_list({
	    contract_name: item.contract_name,
	    contract_num: item.contract_num,
	    a_name: item.a_name,
	    b_name:item.b_name,
	    project_manager_name:item. project_manager_name,
	    executor:item.executor,
	    prive:item.prive,
	    total_prive:item.total_prive,
	    difference:item.difference,
	    pay_method:item.pay_method,
	    arrive_time:item.arrive_time,
	    remarks:item.remarks,
	    enclosure_id:item.enclosure_id
	})
}