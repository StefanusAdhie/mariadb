const mariadb = require("mariadb-typescript");

const connection = mariadb({
  user: "root",
  password: "asdf1234*",
  database: "mysql",
});

module.exports = connection;
