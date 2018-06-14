export default class yanshoudan_list{
  constructor({approval_id,company_id,form_id,type_id}){
    this.approval_id = approval_id
    this.company_id = company_id
    this.form_id = form_id
    this.type_id = type_id
  }
}
export  function create_yanshoudan_list(item) {
  return new yanshoudan_list({
    approval_id:item.approval_id,
    company_id:item.company_id,
    form_id:item.form_id,
    type_id:item.type_id
  })
}
