export default class order {
  constructor({uid,sequence}) {
    this.uid = uid
    this.sequence = sequence
  }
}

export function createOrder(item,index) {
  return new order({
    uid: item.uid,
    sequence: index,

  })
}

