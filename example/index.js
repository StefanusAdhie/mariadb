const mariadb = require("./connection/mariadb");

(async () => {
  try {
    // check connection
    const ping = await mariadb.ping();
    console.log({ ping });
    // return { ping: 'PONG' }

    // create connection
    await mariadb.createConnection();

    // query
    const user = await mariadb.query("SELECT Host, User FROM user");
    console.log({ user });
    // return {
    //   user: [
    //     RowDataPacket { Host: '%', User: 'root' },
    //     RowDataPacket { Host: 'localhost', User: 'root' }
    //   ]
    // }
  } catch (error) {
    console.log({ error });
  }
})();
