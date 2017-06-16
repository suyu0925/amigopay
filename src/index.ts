'use strict'

import * as api from './lib/api'

export { createOrder, IOption, IOrder } from './lib/api'

export class AmigoPay {
  private option: api.IOption

  constructor(option: api.IOption) {
    this.option = option
  }

  public async createOrder(order: api.IOrder) {
    return await api.createOrder(this.option, order)
  }

  public parseCallback(data: object) {
    return api.parseCallback(this.option, data)
  }

  public feedback(done: boolean) {
    return api.feedback(done)
  }
}
