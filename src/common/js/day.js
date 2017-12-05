
export default class dayList {
  constructor({avatar, enclosure,add_time,summary_today,tomorrow_plan,work_exp,name,form_type}) {
    this.enclosure = enclosure
    this.add_time = add_time
    this.avatar = avatar
    this.summary_today = summary_today
    this.tomorrow_plan = tomorrow_plan
    this.work_exp = work_exp
    this.name = name
    this.form_type = form_type
  }
}

export function createDayList(item) {
  return new dayList({
    enclosure: item.enclosure,
    add_time: item.add_time,
    summary_today: item.summary_today,
    tomorrow_plan: item.tomorrow_plan,
    work_exp: item.work_exp,
    name: item.name,
    form_type: item.form_type,
    avatar: 'http://img-bbsf.6655.la/' +item.avatar
  })
}

