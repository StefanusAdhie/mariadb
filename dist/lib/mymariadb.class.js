"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
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
    constructor(param) {
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
        return mysql_1.default.createPool({
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
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
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
        }));
    }
    createConnection() {
        const connection = mysql_1.default.createConnection({
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
            database: this.database,
        });
        connection.connect((error) => __awaiter(this, void 0, void 0, function* () {
            if (error) {
                this.connected = false;
                console.log({ mariadb: error.message });
                yield this.reconnect();
            }
            else {
                this.connected = true;
                console.log({
                    mariadb: `mariadb connected database ${this.database}`,
                });
            }
        }));
        connection.on("error", (error) => __awaiter(this, void 0, void 0, function* () {
            if (error) {
                this.connected = false;
                console.log({ mariadb: error.message });
                yield this.reconnect();
            }
            else {
                this.connected = true;
                console.log({
                    mariadb: `mariadb connected database ${this.database}`,
                });
            }
        }));
        this.connection = connection;
        return connection;
    }
    reconnect() {
        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            this.count_reconnect = this.count_reconnect + 1;
            if (this.count_reconnect >= this.count_max_reconnect) {
                return console.log("PLEASE CHECK DATABASE CONNECTION");
            }
            return yield this.createConnection();
        }), this.timeout_reconnect);
    }
    query(query, data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.connection) {
                this.connection.query(query, data, (error, result) => __awaiter(this, void 0, void 0, function* () {
                    if (error) {
                        console.log({ mariadb: error.message });
                        return reject("data not found");
                    }
                    else {
                        return resolve(result);
                    }
                }));
            }
            else {
                console.log({ mariadb: "internal server error" });
                return reject("internal server error");
            }
        }));
    }
}
exports.default = MyMariaDB;
