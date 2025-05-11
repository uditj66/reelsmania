import mongoose, { Schema, model, models } from "mongoose";

export const Video_Dimensions = {
  height: 2160,
  width: 3840,
} as const;
export interface Ivideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls: boolean;
  transformation: {
    height: Number;
    width: Number;
    quality?: Number;
  };
  createdAt: Date;
  updatedAt: Date;
}
const videoSchema = new Schema<Ivideo>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: Video_Dimensions.height },
      width: { type: Number, default: Video_Dimensions.width },
      quality: { type: Number, min: 1, max: 100 },
    },
  },
  {
    timestamps: true,
  }
);

const Video = models?.Video || model<Ivideo>("Video", videoSchema);
export default Video;
