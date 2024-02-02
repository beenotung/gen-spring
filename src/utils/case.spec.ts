import { expect } from 'chai'
import { camel_to_snake } from './case'

describe('camelToSnake', () => {
  it('should convert userId to user_id', () => {
    expect(camel_to_snake('userId')).to.equals('user_id')
  })
  it('should convert isInHK to is_in_hk', () => {
    expect(camel_to_snake('isInHK')).to.equals('is_in_hk')
  })
})
