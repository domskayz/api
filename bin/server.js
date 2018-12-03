const http = require("http");
const debug = require("debug")("nodeStore:server");
const app = require("../src/app");

// Error port.
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
};
const onError = error => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    switch (error.code) {
        case "EACCES":
            console.log(bind + " Erro por  Falta de privilegios");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.log(bind + " Erro, Porta em uso");
            process.exit(1);
            break;
        default:
            throw error;
    }
};
const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
};


const port = normalizePort(process.env.port || "3000");
app.set("port", port);


const server = http.createServer(app);
server.listen(port);
console.log("Servidor rodando na porta " + port);

server.on("error", onError);
server.on("listening", onListening);
