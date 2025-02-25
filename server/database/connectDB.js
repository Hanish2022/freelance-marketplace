import mongoose from "mongoose";

const connetDB = async () => {
  try {
    const conenctionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `DB connected : hosted at -> ${conenctionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Error in connecting database", error);
  }
};
export default connetDB;
