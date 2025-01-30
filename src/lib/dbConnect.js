import mongoose from "mongoose";

const connection = {};

const connectmongoDB = async () => {
  if (connection.isConnected) {
    console.log("Database Is Already Connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.NEXT_MONGOOSE_URI);
    connection.isConnected = db.connections[0].readyState;
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Databse connection Failed", error);
    process.exit(1);
  }
};

export default connectmongoDB;
