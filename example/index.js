const mariadb = require("@stefanusadhie/mariadb");

const connection = mariadb({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "asdf1234*",
  // database: "tradepro",
  max_reconnect: 2,
  timeout_reconnect: 1000,
});

(async () => {
  const ping = await connection.ping();
  // return "PONG"

  const connected = await connection.createConnection();

  setInterval(async () => {
    try {
      const query = await connection.query("select host,user from mysql.user");
      console.log({ query });
    } catch (error) {
      console.log({ error });
    }
  }, 5000);
})();

// process.stdin.resume(); //so the program will not close instantly

// function exitHandler(options, exitCode) {
//   if (options.cleanup) console.log("clean");
//   if (exitCode || exitCode === 0) console.log(exitCode);
//   if (options.exit) process.exit();
// }

// //do something when app is closing
// process.on("exit", exitHandler.bind(null, { cleanup: true }));

// //catches ctrl+c event
// process.on("SIGINT", exitHandler.bind(null, { exit: true }));

// // catches "kill pid" (for example: nodemon restart)
// process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
// process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

// //catches uncaught exceptions
// process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
