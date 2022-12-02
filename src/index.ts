import MyMariaDB from "./lib/mymariadb.class";

/**
 * @interface
 * interface from use class MyMariaDB
 */
interface IMariaDB {
  host: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  max_reconnect?: number;
  timeout_reconnect?: number;
}

/**
 * @function asdf
 * ini asdf
 */
module.exports = (param: IMariaDB) => {
  return new MyMariaDB(param);
};
