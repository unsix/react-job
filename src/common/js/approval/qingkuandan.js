export default class qingkuandan_list {
  constructor({contract_name,
  	contract_name_new,
  	worker_type,
  	request_name,
  	phone,
  	account_name,
  	bank_address,
  	bank_card,
  	bank_name,
  	request_num,
  	subtotal,
  	gain_reduction_subtotal,
  	request_subtotal,
  	draw_money_name,
  	contract_state,
  	request_content,
  	project_manager_name,
  	worker_contract_id,
  	balance_subtotal,
  	request_money_basis_type,
  	form_approval_id,
  	approval_type,
  	many_enclosure}) {
    this.contract_name = contract_name
    this.contract_name_new = contract_name_new
    this.request_name = request_name
    this.account_name = account_name
    this.project_manager_name = project_manager_name
    this.bank_address = bank_address
    this.bank_card = bank_card
    this.bank_name = bank_name
    this.request_num = request_num
    this.subtotal = subtotal
    this.gain_reduction_subtotal = gain_reduction_subtotal
    this.request_subtotal = request_subtotal
    this.contract_state = contract_state
    this.worker_contract_id = worker_contract_id
    this.many_enclosure = many_enclosure
    this.worker_type = worker_type
    this.form_approval_id = form_approval_id
    this.phone = phone
    this.draw_money_name = draw_money_name
    this.request_content = request_content
    this.balance_subtotal = balance_subtotal
    this.approval_type = approval_type
    this.request_money_basis_type = request_money_basis_type
  
  }
}
export function create_qingkuandan_list(item) {
	console.log(item)
	return new qingkuandan_list({
	    contract_name:item.contract_name,
	    contract_name_new: item.contract_name_new,
	    request_name: item.request_name,
	    account_name:item.account_name,
	    project_manager_name:get_manager_name(item),
	    executor:item.executor,
	    bank_card:item.bank_card,
	    bank_name:item.bank_name,
	    request_num:item.request_num,
	    subtotal:item.subtotal,
	    approval_type:item.approval_type,
	    request_money_basis_type:item.request_money_basis_type,
	    gain_reduction_subtotal:item.gain_reduction_subtotal,
	    request_subtotal:item.request_subtotal,
	    contract_state:item.contract_state,
	    worker_contract_id:item.worker_contract_id,
	    bank_address:item.bank_address,
	    many_enclosure:item.many_enclosure,
	    request_content:item.request_content,
	    worker_type:item.worker_type,
	    phone:item.phone,
	    form_approval_id:item.form_approval_id,
	    draw_money_name:item.draw_money_name,
	    balance_subtotal:item.balance_subtotal
	   
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