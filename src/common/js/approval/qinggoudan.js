export default class qinggoudan_list {
  constructor({request_contract_address,
  	contract_name_new,
  	department_name,
  	buy_person,
  	buy_person_phone,
  	contract_responsible,
  	responsible_tel,
  	receive_address,
  	request_buy_department,
  	arrival_time,
  	consignee,
    consignee_uid,
    buy_person_uid,
  	consignee_phone,
  	content,
  	project_manager_name,
  	enclosure_id,
  	total,
    project_manager,
  	many_enclosure,}) {
    this.request_contract_address = request_contract_address
    this.contract_name_new = contract_name_new
    this.department_name = department_name
    this.buy_person = buy_person
    this.project_manager_name = project_manager_name
    this.buy_person_phone = buy_person_phone
    this.contract_responsible = contract_responsible
    this.request_buy_department = request_buy_department
    this.responsible_tel = responsible_tel
    this.receive_address = receive_address
    this.arrival_time = arrival_time
    this.consignee = consignee
    this.consignee_phone = consignee_phone
    this.content = content
    this.many_enclosure = many_enclosure
    this.enclosure_id = enclosure_id
    this.total = total
    this.consignee_uid  = consignee_uid
    this.buy_person_uid = buy_person_uid
    this.project_manager = project_manager
  }
}
export function create_qinggoudan_list(item) {
	return new qinggoudan_list({
			many_enclosure:item.many_enclosure,
	    request_contract_address:item.request_contract_address,
	    contract_name_new: item.contract_name_new,
	    department_name: item.department_name,
	    buy_person:item.buy_person,
	    buy_person_phone:item.buy_person_phone,
	    project_manager_name:get_manager_name(item),
	    executor:item.executor,
	    contract_responsible:item.contract_responsible,
	    responsible_tel:item.responsible_tel,
	    request_buy_department:item.request_buy_department,
	    receive_address:item.receive_address,
	    arrival_time:item.arrival_time,
	    consignee:item.consignee,
	    consignee_phone:item.consignee_phone,
	    content:item.content,
	    total:item.total,
	    enclosure_id:get_enclosure_id(item),
      buy_person_uid:item.buy_person_uid,
      consignee_uid:item.consignee_uid,
    project_manager:item.project_manager
	})
}
function getTime(time){
var timestamp2 = Date.parse(new Date(time));
timestamp2 = timestamp2 / 1000 +86400
		var date = new Date();
    date.setTime(timestamp2 * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d
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