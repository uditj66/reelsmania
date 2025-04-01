import mongoose, { Schema, model, models } from "mongoose";


export const Video_Dimensions = {
  height: 1080,
  width: 1920,
} as const;
export interface Ivideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls: boolean;
  videoAttributes: {
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
    thumbnailUrl: { type: String, required:true },
    controls: { type: Boolean, default: true },
    videoAttributes: {
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
