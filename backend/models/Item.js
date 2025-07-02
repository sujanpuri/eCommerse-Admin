import mongoose from 'mongoose';

const restockSchema = new mongoose.Schema({
  quantity: Number,
  date: { type: Date, default: Date.now },
});

const salesSchema = new mongoose.Schema({
  quantity: Number,
  date: { type: Date, default: Date.now },
});

const reviewSchema = new mongoose.Schema({
  user: String, // demo user name
  text: String,
  rating: { type: Number, min: 1, max: 5 },
});

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    image: String,
    category: String,

    quantity: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    soldout: { type: Boolean, default: false },

    restockHistory: [restockSchema],
    salesHistory: [salesSchema],

    // For another app.
    // likes: { type: Number, default: 0 },
    // reviews: [reviewSchema],

    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Item', itemSchema);
