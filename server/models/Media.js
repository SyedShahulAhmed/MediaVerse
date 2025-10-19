import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['movie', 'series', 'anime', 'book', 'game', 'other'],
      default: 'movie',
    },
    genre: { type: String, default: '' },

    // 🗓️ Date is now user-defined (Completed or Planned)
    date: { type: Date, default: null },

    status: {
      type: String,
      enum: ['plan', 'watching', 'completed', 'on-hold', 'dropped'],
      default: 'plan',
    },

    rating: { type: Number, min: 0, max: 10, default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

const Media = mongoose.model('Media', MediaSchema);
export default Media;
