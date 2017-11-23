export default class order {
  constructor({uid}) {
    this.uid = uid
  }
}

export function createOrder(item,index) {
  return new order({
    uid: item.uid
  })
}

