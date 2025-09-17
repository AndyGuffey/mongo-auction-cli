import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  start_price: {
    type: Number,
    required: true,
  },
  reserve_price: {
    type: Number,
    required: true,
  },
});

// In ESM, we use 'export default' instead of 'module.exports'
export default mongoose.model("Item", ItemSchema);
