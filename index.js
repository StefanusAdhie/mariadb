const MyMariaDB = require("./lib/mymariadb.class");

module.exports = ({
  host,
  port,
  user,
  password,
  database,
  max_reconnect,
  timeout_reconnect,
}) => {
  return new MyMariaDB({
    host,
    port,
    user,
    password,
    database,
    max_reconnect,
    timeout_reconnect,
  });
};
