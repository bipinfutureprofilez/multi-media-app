// require("dotenv").config({path: "/.env"})
import { app } from "./app.js";
import connectDB from "./db/connection.js";

const port = process.env.PORT || 8000;

connectDB();
(async () => {
    try {
        app.on("error", (error) => {
            console.log("Error: ", error);
            throw error;
        })
        app.listen(port, () => console.log(`Server is running at: ${port}`))

    } catch (error) {
        console.log(error);
        throw error;
    }
})()