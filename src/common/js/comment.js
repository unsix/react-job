
export default class commentList {
  constructor({avatar, enclosure,add_time,content,comment_id,publish_id,name}) {
    this.enclosure = enclosure
    this.add_time = add_time
    this.avatar = avatar
    this.publish_id = publish_id
    this.comment_id = comment_id
    this.content = content
    this.name = name
    
  }
}

export function createCommentList(item) {
	console.log(item)
  return new commentList({
    enclosure: item.enclosure,
    add_time: item.add_time,
    content: item.content,
    comment_id: item.comment_id,
    name: item.name,
    publish_id: item.publish_id,
    avatar: 'http://img-bbsf.6655.la/Fvq9PpSmgcA_xvWbzzIjcZ2rCrns'
  })
}