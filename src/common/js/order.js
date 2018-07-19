export default class order {
  constructor({uid,sequence_id}) {
    this.uid = uid
    this.sequence_id =sequence_id
  }
}

export function createOrder(item,index) {
  return new order({
    uid: item.uid,
    sequence_id : item.sequence_id
  })
}

