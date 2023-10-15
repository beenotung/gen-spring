import { expect } from 'chai'
import { API, Scope, parse } from './ast'

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
  let scope_list: Scope[] = [
    {
      name: 'user',
      api_list: [
        { method: 'GET', path: '/users', params: [] },
        { method: 'GET', path: '/users/:id/profile', params: ['id'] },
        {
          method: 'PATCH',
          path: '/users/:id/profile/:field',
          params: ['id', 'field'],
        },
      ],
    },
  ]
  expect(ast.scope_list).to.deep.equals(scope_list)
})
