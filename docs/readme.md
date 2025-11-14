# SETUP

## First Installation

use flyenv for database postgresql

setup database with .env file

run this command on terminal
```
copy .env.example .env     
```
setup your .env file and change your database
in AUTH_SECRET set text with random string

then run
```    
bun install             # for install dependencies
bun run db:push         # for setup database
```


# Dev
this section for development database
run this command on terminal
```    
bun run db:gen

bun run db:mig

bun run db:push

bun run db:seed
```    
