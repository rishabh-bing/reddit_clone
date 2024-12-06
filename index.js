const conf = require("./config");

let handler;

handler = require("./app/server");

const app = handler.getAppServer();
const PORT = conf.get("port");

app.listen(PORT, () => {
    console.log("server started at http://localhost:" + PORT);
});

process.on("SIGTERM", function () {
    handler.shutdown().finally(() => process.exit(0));
});
