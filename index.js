"use strict";

const mysql = require("mysql");

/**
 * @author stefanus adhie
 * @since 0.0.1
 * @see https://github.com/mysqljs/mysql
 * @version 2.18.1
 * @class MyMariaDB
 * @description
 * class for connect to database mariadb
 *
 * @constructor
 *
 * @param {string}  host The hostname of the database you are connecting to
 * @param {string}  port The port number to connect to
 * @param {string}  user The MySQL user to authenticate as
 * @param {string}  password  The password of that MySQL user
 * @param {string}  database Name of the database to use for this connection (Optional)
 */
class MyMariaDB {
  constructor({
    host,
    port,
    user,
    password,
    database,
    max_reconnect = null,
    timeout_reconnect = null,
  }) {
    this.host = host || "localhost";
    this.port = port || 3306;
    this.user = user || "root";
    this.password = password || "";
    this.database = database;
    this.connected = null;
    this.connection = null;
    this.count_reconnect = 0;
    this.count_max_reconnect = max_reconnect || 1000;
    this.timeout_reconnect = timeout_reconnect || 3000;
  }

  /**
   * @description
   * test mariadb server connection
   *
   * @example
   * const MyMariaDB = require("./src/connection/mariadb.class");
   * const mariadb = new MyMariaDB(host, port, user, password, database);
   *
   * mariadb.ping();
   */
  ping() {
    return new Promise(async (resolve, reject) => {
      // mariadb pool connection
      this.poolConnection().getConnection((error, connection) => {
        // error connection
        if (error) {
          console.log({ message: error.message });
          return reject("internal server error");
        }

        connection.ping((error) => {
          // When done with the connection, release it.
          connection.release();

          // error ping
          if (error) {
            console.log({ message: error.message });
            return reject(error.message);
          }

          // success
          return resolve("PONG");
        });
      });
    });
  }

  createConnection() {
    const connection = mysql.createConnection({
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.password,
      database: this.database,
    });

    connection.connect(async (error) => {
      if (error) {
        this.connected = false;
        console.log({ message: error.message });
        await this.reconnect();
      } else {
        this.connected = true;
        console.log({
          message: `mariadb connected database ${this.database}`,
        });
      }
    });

    connection.on("error", async (error) => {
      if (error) {
        this.connected = false;
        console.log({ message: error.message });
        await this.reconnect();
      } else {
        this.connected = true;
        console.log({
          message: `mariadb connected database ${this.database}`,
        });
      }
    });

    this.connection = connection;
    return connection;
  }

  reconnect() {
    setTimeout(async () => {
      this.count_reconnect = this.count_reconnect + 1;

      if (this.count_reconnect >= this.count_max_reconnect) {
        return console.log("PLEASE CHECK DATABASE CONNECTION");
      }
      return await this.createConnection();
    }, this.timeout_reconnect);
  }

  query(query, data) {
    return new Promise(async (resolve, reject) => {
      if (this.connection) {
        this.connection.query(query, data, async (error, result) => {
          if (error) {
            console.log({ message: error.message });
            return reject("data not found");
          } else {
            return resolve(result);
          }
        });
      } else {
        console.log({ message: "internal server error" });
        return reject("internal server error");
      }
    });
  }
}

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
