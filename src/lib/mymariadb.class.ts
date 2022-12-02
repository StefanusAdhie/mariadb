import mysql from "mysql";

/**
 * @interface
 * interface IConstructor for constructor class MyMariaDB
 */
interface IConstructor {
  host: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  max_reconnect?: number;
  timeout_reconnect?: number;
}

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
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  count_max_reconnect: number;
  timeout_reconnect: number;
  connected: boolean;
  connection: any;
  count_reconnect: number;

  constructor(param: IConstructor) {
    this.host = param.host;
    this.port = param.port || 3306;
    this.user = param.user || "root";
    this.password = param.password || "";
    this.database = param.database || "";
    this.count_max_reconnect = param.max_reconnect || 5;
    this.timeout_reconnect = param.timeout_reconnect || 1000;
    this.connected = false;
    this.connection = null;
    this.count_reconnect = 0;
  }

  /**
   * @description
   * create pool connection
   *
   * @returns {function}
   */
  poolConnection() {
    return mysql.createPool({
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.password,
      database: this.database,
    });
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
          console.log({ mariadb: error.message });
          return reject("internal server error");
        }

        connection.ping((error) => {
          // When done with the connection, release it.
          connection.release();

          // error ping
          if (error) {
            console.log({ mariadb: error.message });
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
        console.log({ mariadb: error.message });
        await this.reconnect();
      } else {
        this.connected = true;
        console.log({
          mariadb: `mariadb connected database ${this.database}`,
        });
      }
    });

    connection.on("error", async (error) => {
      if (error) {
        this.connected = false;
        console.log({ mariadb: error.message });
        await this.reconnect();
      } else {
        this.connected = true;
        console.log({
          mariadb: `mariadb connected database ${this.database}`,
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

  query(query: string, data: []) {
    return new Promise(async (resolve, reject) => {
      if (this.connection) {
        this.connection.query(
          query,
          data,
          async (error: boolean | any, result: []) => {
            if (error) {
              console.log({ mariadb: error.message });
              return reject("data not found");
            } else {
              return resolve(result);
            }
          }
        );
      } else {
        console.log({ mariadb: "internal server error" });
        return reject("internal server error");
      }
    });
  }
}

export default MyMariaDB;
