export default class qinggoudan_list {
  constructor({request_contract_address,
  	contract_name_new,
  	department_name,
  	buy_person,
  	buy_person_phone,
  	contract_responsible,
  	responsible_tel,
  	receive_address,
  	arrival_time,
  	consignee,
  	consignee_phone,
  	content,
  	project_manager_name,
  	enclosure_id,
  	many_enclosure}) {
    this.request_contract_address = request_contract_address
    this.contract_name_new = contract_name_new
    this.department_name = department_name
    this.buy_person = buy_person
    this.project_manager_name = project_manager_name
    this.buy_person_phone = buy_person_phone
    this.contract_responsible = contract_responsible
    this.responsible_tel = responsible_tel
    this.receive_address = receive_address
    this.arrival_time = arrival_time
    this.consignee = consignee
    this.consignee_phone = consignee_phone
    this.content = content
    this.many_enclosure = many_enclosure
    this.enclosure_id = enclosure_id
  
  }
}
export function create_qinggoudan_list(item) {
	return new qinggoudan_list({
			many_enclosure:item.many_enclosure,
	    request_contract_address:item.request_contract_address,
	    contract_name_new: item.contract_name_new,
	    department_name: item.department_name,
	    buy_person:item.buy_person,
	    project_manager_name:get_manager_name(item),
	    executor:item.executor,
	    contract_responsible:item.contract_responsible,
	    responsible_tel:item.responsible_tel,
	    receive_address:item.receive_address,
	    arrival_time:item.arrival_time,
	    consignee:item.consignee,
	    consignee_phone:item.consignee_phone,
	    content:item.content,
	    enclosure_id:get_enclosure_id(item)
	   
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
function get_enclosure_id(item){
	if(!item.enclosure_id){
		return
	}else{
		return item.enclosure_id
	}
	
	
}
