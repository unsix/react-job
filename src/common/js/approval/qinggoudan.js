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
  	img}) {
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
    this.img = img
  
  }
}
export function create_qinggoudan_list(item) {
	console.log(item)
	return new qinggoudan_list({
		img:img_id(item),
	    request_contract_address:item.request_contract_address,
	    contract_name_new: item.contract_name_new,
	    department_name: item.department_name,
	    buy_person:item.buy_person,
	    project_manager_name:'项目经理',
	    executor:item.executor,
	    contract_responsible:item.contract_responsible,
	    responsible_tel:item.responsible_tel,
	    receive_address:item.receive_address,
	    arrival_time:item.arrival_time,
	    consignee:item.consignee,
	    consignee_phone:item.consignee_phone,
	    content:item.content
	   
	})
}

function img_id(item){
	if( !item.contract_id || item.contract_id === null){
		return '0'
	}
	if(item.contract_id[0].type === 3){
		return item.contract_id[0].contract_id
	}
}