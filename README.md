# MariaDB

## Install

```
npm i -s @stefanusadhie/mariadb
```

## Create Connection

```
const mariadb = require("@stefanusadhie/mariadb");

const mariadb_class = mariadb({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "tradepro",
  max_reconnect: 2,
  timeout_reconnect: 1000,
});

mariadb_class.createConnection();
```
