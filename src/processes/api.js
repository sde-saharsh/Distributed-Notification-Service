import app from "../app.js"
import "dotenv/config"
import { connectDB } from "../config/database.js";

const PORT = process.env.PORT || 3000;

const startServer = async()=>{
    await connectDB();

    app.listen(PORT,() => {
        console.log(`API is running on the port ${PORT}`);
    });
};

startServer();

