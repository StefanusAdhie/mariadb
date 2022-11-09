const mariadb = require("@stefanusadhie/mariadb");

const connection = mariadb({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  // database: "tradepro",
  max_reconnect: 2,
  timeout_reconnect: 1000,
});

(async () => {
  const ping = await connection.ping();
  // return "PONG"

  const connected = await connection.createConnection();
})();
