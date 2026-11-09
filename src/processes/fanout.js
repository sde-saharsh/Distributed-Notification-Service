import "dotenv/config"

import fanoutWorker from "../workers/fanout.worker.js"

const shutdown = async() => {
    console.log("Shutting down fan-out worker.....");
    await fanoutWorker.close();
    process.exit(1);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);