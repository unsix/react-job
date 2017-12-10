
export default class dayList {
  constructor({avatar, enclosure,add_time,summary_today,tomorrow_plan,work_exp,name,form_type,publish_id,start_time,time_sequence,like_id,uid}) {
    this.enclosure = enclosure
    this.add_time = add_time
    this.avatar = avatar
    this.summary_today = summary_today
    this.tomorrow_plan = tomorrow_plan
    this.work_exp = work_exp
    this.name = name
    this.form_type = form_type
    this.publish_id = publish_id
    this.start_time = start_time
    this.time_sequence = time_sequence
    this.like_id = like_id
    this.uid = uid
    
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
    like_id: item.like_id,
    publish_id: item.publish_id,
    uid: item.uid,
    start_time: getTime(item.start_time),
    time_sequence: sequenceTime(item.add_time),
    avatar: 'http://bbsf-file.hzxb.net/Fvq9PpSmgcA_xvWbzzIjcZ2rCrns'
  })
}
function sequenceTime(time){
	let stringTime = time;
	let timestamp2 = Date.parse(new Date(stringTime));
	timestamp2 = timestamp2 / 1000;
	//2014-07-10 10:21:12的时间戳为：1404958872 
	return timestamp2
}
function getTime(time){
		var date = new Date();  
    date.setTime(time * 1000);  
    var y = date.getFullYear();      
    var m = date.getMonth() + 1;      
    m = m < 10 ? ('0' + m) : m;      
    var d = date.getDate();      
    d = d < 10 ? ('0' + d) : d;      
    var h = date.getHours();    
    h = h < 10 ? ('0' + h) : h;    
    var minute = date.getMinutes();    
    var second = date.getSeconds();    
    minute = minute < 10 ? ('0' + minute) : minute;      
    second = second < 10 ? ('0' + second) : second;     
    return y + '年' + m + '月' + d + '日'
}
