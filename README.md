# **kanaka**
*(Hawaiian)* - human.

Identity management service.


## Method list

### Registration

**Request**
```bash
POST /auth/registration
{
  "email": "john-dou@gmail.com",
  "password": "very-secret-password"
}
```

**Response**
```bash
Status: 201 Created 
{
    "email": "john-dou@gmail.com"
}
```


### Login

**Request**
```bash
POST /auth/login
{
  "login": "john-dou@gmail.com",
  "password": "very-secret-password"
}
```

**Response**
```bash
Status: 201 Created 
{
    "accessToken": "3C7OEh7RJm0SIad1cn2Sh10ZdmTRtvzdv1kMNqQ5",
    "refreshToken": "5QceebSbjZBx4WR6uOsyzdyEdNHqsL72X78jSbJr",
    "expireIn": 1588611490,
    "refreshTokenExpireIn": 1591027090
}
```


### Logout

**Request**
```bash
DELETE /auth/logout
Authorization: Bearer <Access Token>
```

**Response**
```bash
Status: 204 No Content
```


### Me

**Request**
```bash
GET /auth/me
Authorization: Bearer <Access Token>
```

**Response**
```bash
Status: 200 OK
{
    "email": "john-dou@gmail.com"
}
```


### Refresh Token

**Request**
```bash
PATCH /auth/refresh-token
Authorization: Bearer <Refresh Token>
```

**Response**
```bash
Status: 201 Created 
{
    "accessToken": "3C7OEh7RJm0SIad1cn2Sh10ZdmTRtvzdv1kMNqQ5",
    "refreshToken": "5QceebSbjZBx4WR6uOsyzdyEdNHqsL72X78jSbJr",
    "expireIn": 1588611490,
    "refreshTokenExpireIn": 1591027090
}
```


### Authorize (internal method) 

That method returns `Authorization` header with JWT token. Developed for internal use.

**Request**
```bash
PATCH /internal/authorize
Authorization: Bearer <Access Token>
```

**Response**
```bash
Status: 204 No Content
Authorization: Bearer <JWT Token>
```
