# Installation Required

```
MongoDB
Typescript
Redis:
    Linux base system require to install Redis
    for windows install windows sub-system for linux (WSL)
    powershell > run command > wsl --install
    follow this ---> https://redis.io/docs/getting-started/installation/install-redis-on-windows/
Redis-commander
    -   GUI for redis > runs on http://127.0.0.1:8081/
    -   npm i -g redis-commander
    -   To run use "redis-commander" command

```

# .env file

```
PORT=<port>
DB_HOST=<mongo db url>
DB_NAME=<DB name>
ACCESS_TOKEN_SECRET=<accessTokenSecret>
REFRESH_TOKEN_SECRET=<refreshTokenSecret>
```

## File Naming Rules by directory:

all the file should follow below rules.

```
    "src/assets/**/*.{png,svg}": "KEBAB_CASE",
    "src/store/**/*.{js,ts}": "CAMEL_CASE",
    "src/utils/**/*.{js,ts}": "CAMEL_CASE",
    "src/components/**/*.{jsx,tsx,js,ts}": "PASCAL_CASE",
    "src/context/**/*.{jsx,tsx,js,ts}": "PASCAL_CASE",
    "src/layouts/**/*.{jsx,tsx,js,ts}": "PASCAL_CASE",
    "src/pages/**/*.{jsx,tsx,js,ts}": "PASCAL_CASE"
```

## Folder Naming Rules by directory:

all the folder should follow below rules.

```
     "
```
