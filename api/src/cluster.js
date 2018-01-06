const cluster = require('cluster');
const os = require('os');

const cpus = os.cpus();

if(cluster.isMaster) {
    cpus.forEach(() => cluster.fork());

    // Listening connection event
    cluster.on("listening", work => {
        "use strict";
        console.log(`Cluster ${work.process.pid} connected`);
    });

    // Disconnect
    cluster.on("disconnect", work => {
        "use strict";
        console.log(`Cluster ${work.process.pid} disconnected`);
    });

    // Exit
    cluster.on("exit", worker => {
        "use strict";
        console.log(`Cluster ${worker.process.pid} is dead`);
        cluster.fork();
    });
} else {
    require("./app");
}