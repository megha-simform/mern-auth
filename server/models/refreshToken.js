import mongoose from "mongoose";
import "dotenv/config";

// const refreshTokenExpiryTime = process.env.REFRESH_TOKEN_EXPIRY_TIME;

const Schema = mongoose.Schema;

// Refresh Token schema definition.
const refreshTokenSchema = new Schema(
  {
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    refreshTokenCreatedAt: {
      type: Date,
      default: new Date().toLocaleString("en-Us", { timeZone: "Asia/Kolkata" }),
      // index: { expires: refreshTokenExpiryTime },
    },
  }
  // { timestamps: true },
);

refreshTokenSchema.index(
  { refreshTokenCreatedAt: 1 },
  { expireAfterSeconds: 3600 }
);

export default mongoose.model("refreshToken", refreshTokenSchema);
