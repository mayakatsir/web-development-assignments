// initial file
@baseUrl = http://localhost:3000
@token =

### Root
GET {{baseUrl}}/

### List users
GET {{baseUrl}}/api/users

### Get user by id
GET {{baseUrl}}/api/users/1

### Create user
POST {{baseUrl}}/api/users
Content-Type: application/json

{
  "name": "Bob"
}

### Update user
PUT {{baseUrl}}/api/users/1
Content-Type: application/json

{
  "name": "Bobby"
}

### Delete user
DELETE {{baseUrl}}/api/users/1

### Example with Authorization header
GET {{baseUrl}}/api/protected
Authorization: Bearer {{token}}

### Query + headers example
GET {{baseUrl}}/api/users?page=1&limit=10
Accept: application/json
