import mongoose from 'mongoose';
import 'dotenv/config';

// const accessTokenExpiryTime = process.env.ACCESS_TOKEN_EXPIRY_TIME;

const Schema = mongoose.Schema;

// Access Token schema definition.
const accessTokenSchema = new Schema(
  {
    accessToken: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    accessTokenCreatedAt: {
      type: Date,
      default: new Date().toLocaleString('en-Us', { timeZone: 'Asia/Kolkata' }),
      // index: { expires: accessTokenExpiryTime },
    },
  },
  //   { timestamps: true },
);

accessTokenSchema.index({ accessTokenCreatedAt: 1 }, { expireAfterSeconds: 60 });

export default mongoose.model('accessToken', accessTokenSchema);
