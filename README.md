# Binar Academy Challenge Chapter 5

lakukan seeders untuk dapat user role superadmin dan passwordnya adalah "1234567"

# API endpoint requirements

## Users API

##### GET: /api/v1/users

```shell
only superadmin can access this
```

##### GET /api/v1/users/2

```shell
only superadmin can access this
```

##### POST /api/v1/users

```shell
only superadmin can access this
```

##### PUT /api/v1/users/2

```shell
only superadmin and his own data can access this
```

##### DELETE /api/v1/users/2

```shell
only superadmin and his own data can access this
```

## Auth API

##### GET /api/v1/auth

```shell
only superadmin can access this
```

##### POST /api/v1/auth/register

```shell
only member can access this
```

##### POST /api/v1/auth/login

```shell
superadmin, admin, and member can access this
```

##### GET /api/v1/auth/current-user

```shell
superadmin, admin, and member can access this
```

##### PUT /api/v1/auth/2

```shell
only superadmin and his own data can access this
```

##### DELETE /api/v1/auth/2

```shell
only superadmin and his own data can access this
```

## Cars API

##### GET /api/v1/cars

```shell
only superadmin and admin can access this
```

##### GET /api/v1/cars/1

```shell
only superadmin and admin can access this
```

##### POST /api/v1/cars

```shell
only superadmin and admin can access this
```

##### PUT /api/v1/cars/1

```shell
only superadmin and admin can access this
```

##### DELETE /api/v1/cars/1

```shell
only superadmin and admin can access this
```
