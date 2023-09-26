import mongoose from "mongoose";
import colors from "colors"
const dbconnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MOGODB_URL)
        // console.log(`connected to mongodb ${conn.connection.host}`.bgMagenta.white);
    } catch (error) {
        // console.log(`error while connecting mongodb: ${error}`);
    }
}

export default dbconnect