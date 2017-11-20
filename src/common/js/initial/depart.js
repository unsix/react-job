export default class depart_list {
  constructor({department_describe, department_id,department_name}) {
    this.department_describe = department_describe
    this.department_id = department_id
    this.department_name = department_name
  }
}

export function create_depart_list(item) {
  return new depart_list({
    department_describe: item.department_describe,
    department_id:item.department_id,
    department_name: item.department_name
  })
}