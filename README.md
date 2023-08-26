# Archea-Vault-API

---

## Installation

**Clone the repository and enter in repository:**

```
git clone https://github.com/Pixel-Conqueror/Archea-Vault-API.git && cd Archea-Vault-API
```

**Create .env:**

```
cp .env.exemple .env
```

**Create container and start server:**

```
docker-compose build && docker-compose up -d
```

**Open shell in api container** (_in a new terminal_)**:**

```
docker exec -it api /bin/sh
```

**Run migration:**

```
node ace migration:run
```

**Listen Bull Queue for jobs:**

```
node ace bull:listen
```

---

## Routes

#### Auth

|                   Type                   | Url         | Middleware(s) |
| :--------------------------------------: | :---------- | :------------ |
| <span style="color: #2d4bbd">POST</span> | _/register_ | None          |
| <span style="color: #2d4bbd">POST</span> | _/login_    | None          |
| <span style="color: #26B260">GET</span>  | _/logout_   | Auth          |

#####Expected body datas:
_/register_

```json
{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "password": "string"
}
```

_/login_

```json
{
  "email": "string",
  "password": "string"
}
```
___
#### Files

|                    Type                    | Url                     | Middleware(s)         |
| :----------------------------------------: | :---------------------- | :-------------------- |
|  <span style="color: #26B260">GET</span>   | _/fileList_             | Auth                  |
|  <span style="color: #26B260">GET</span>   | _/fileDownload/:fileId_ | Auth                  |
|  <span style="color: #2d4bbd">POST</span>  | _/fileUpload_           | Auth, StorageCapacity |
| <span style="color: #efdf18">PATCH</span>  | _/fileUpdate_           | Auth, FileAccess      |
| <span style="color: #c71035">DELETE</span> | _/fileDelete_           | Auth, FileAccess      |

#####Expected params datas:
_/fileDownload/:fileId_

```json
{
  "fileId": "string"
}
```

#####Expected body datas:
_/fileUpload_

```json
{
  "files": "array of files"
}
```

_/fileUpdate_

```json
{
  "fileId": "string",
  "name": "string",
}
```
_/fileDelete_

```json
{
  "fileId": "string"
}
```
___
#### Monitoring

|                  Type                   | Url       | Middleware(s) |
| :-------------------------------------: | :-------- | :------------ |
| <span style="color: #26B260">GET</span> | _/health_ | None          |

___

## Middlewares

#### Auth
Ensures the protection and authentication of resources by verifying the provided credentials in the HTTP authorization header. This ensures that only authenticated users can access the secured parts of the application.

```
Authorization: Bearer <token>
```

#### StorageCapacity
Ensures that the user does not exceed the storage capacity allocated to him.

#### FileAccess
Ensures that the user has access to the requested resource.

---