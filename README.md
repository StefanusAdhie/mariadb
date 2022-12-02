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
  database: "mydata",
  max_reconnect: 2,
  timeout_reconnect: 1000,
});

mariadb_class.createConnection();
```

| name              | type   | default   |
| ----------------- | ------ | --------- |
| host              | string | localhost |
| port              | number | 3306      |
| user              | string | root      |
| password          | string |           |
| database          | string |           |
| max_reconnect     | number | 5         |
| timeout_reconnect | number | 1000      |
