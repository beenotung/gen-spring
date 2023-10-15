import { expect } from 'chai'
import { API, parse } from './ast'

let text = `
GET /users
GET /users/:id/profile
POST /users/login
POST /users/register
GET /notes
GET /notes/:id
POST /notes
DELETE /notes/:id
PATCH /notes/:id
`

it('should parse api method and path', () => {
  let text = `
GET /users
GET /users/:id/profile
PATCH /users/:id/profile/:field
	`
  let ast = parse(text)
  let api_list: API[] = [
    { method: 'GET', path: '/users', params: [] },
    { method: 'GET', path: '/users/:id/profile', params: ['id'] },
    {
      method: 'PATCH',
      path: '/users/:id/profile/:field',
      params: ['id', 'field'],
    },
  ]
  expect(ast.api_list).to.deep.equals(api_list)
})
