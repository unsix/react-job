export default class qingkuandan_list {
  constructor({contract_name,
  	contract_name_new,
  	worker_type,
  	request_name,
  	phone,
  	account_name,
  	bank_address,
  	bank_card,
  	request_num,
  	subtotal,
  	gain_reduction_subtotal,
  	request_subtotal,
  	contract_state,
  	request_content,
  	project_manager_name,
  	worker_contract_id,
  	img}) {
    this.contract_name = contract_name
    this.contract_name_new = contract_name_new
    this.request_name = request_name
    this.account_name = account_name
    this.project_manager_name = project_manager_name
    this.bank_address = bank_address
    this.bank_card = bank_card
    this.request_num = request_num
    this.subtotal = subtotal
    this.gain_reduction_subtotal = gain_reduction_subtotal
    this.request_subtotal = request_subtotal
    this.contract_state = contract_state
    this.worker_contract_id = worker_contract_id
    this.img = img
  
  }
}
export function create_qingkuandan_list(item) {
	return new qingkuandan_list({
		img:img_id(item),
	    contract_name:item.contract_name,
	    contract_name_new: item.contract_name_new,
	    request_name: item.request_name,
	    account_name:item.account_name,
	    project_manager_name:'项目经理',
	    executor:item.executor,
	    bank_card:item.bank_card,
	    request_num:item.request_num,
	    subtotal:item.subtotal,
	    gain_reduction_subtotal:item.gain_reduction_subtotal,
	    request_subtotal:item.request_subtotal,
	    contract_state:item.contract_state,
	    worker_contract_id:item.worker_contract_id
	   
	})
}

function img_id(item){
	console.log(item.contract_id)
	if( item.contract_id === null||item.contract_id.length === 0 ){
		return '0'
	}
	if(item.contract_id[0].type === 3){
		return item.contract_id[0].contract_id
	}
}