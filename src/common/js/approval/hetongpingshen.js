export default class hetongpingshen_list {
  constructor({contract_name_new,contract_name,contract_num,a_name,b_name,executor,project_manager_name,prive,contract_id,total_prive,difference,pay_method,arrive_time,end_time,remarks,many_enclosure}) {
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
    this.many_enclosure = many_enclosure
    this.contract_name_new = contract_name_new
    this.contract_id = contract_id
  }
}
//function getTime(time){
//var timestamp2 = Date.parse(new Date(time));
//timestamp2 = timestamp2 / 1000 +86400
//		var date = new Date();  
//  date.setTime(timestamp2 * 1000);  
//  var y = date.getFullYear();      
//  var m = date.getMonth() + 1;      
//  m = m < 10 ? ('0' + m) : m;      
//  var d = date.getDate();      
//  d = d < 10 ? ('0' + d) : d;          
//  return y + '-' + m + '-' + d
//}
export function create_hetongpingshen_list(item) {
	console.log(item)
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
	    contract_id:item.contract_id,
	    many_enclosure:item.many_enclosure,
	    contract_name_new:item.contract_name_new
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
