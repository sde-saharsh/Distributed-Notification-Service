import express from "express"
import notificationRoutes from "./modules/notifications/notification.routes.js"
import dlqRoutes from "./modules/dlq/dlq.routes.js"

const app = express();

app.use(express.json());

app.get("/health",(req,res) => {
    res.status(200).json({
        success: true,
        message: "Notification service"
    });
});

app.use("/api/v1/notifications",notificationRoutes);
app.use("/api/v1/dlq", dlqRoutes);


export default app;