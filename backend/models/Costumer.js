import mongoose from "mongoose";

const costumerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String },
  },
  { timestamps: true }
);

const Costumer = mongoose.model("Costumer", costumerSchema);
export default Costumer;
