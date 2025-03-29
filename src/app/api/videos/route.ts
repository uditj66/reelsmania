import { authOptions } from "@/app/lib/auth";
import { connectDb } from "@/app/lib/dbConfig";
import Video, { Ivideo } from "@/app/models/video.model";

import { getServerSession } from "next-auth";
import { Quando } from "next/font/google";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json(
      { errorDescription: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { errorDescription: "UnAuthorized" },
        {
          status: 401,
        }
      );
    }
    await connectDb();

    const reqBody: Ivideo = await request.json();

    if (
      !reqBody.title ||
      !reqBody.description ||
      !reqBody.thumbnailUrl ||
      reqBody.videoUrl
    ) {
      return NextResponse.json(
        { errorDescription: "Missing Required fields" },
        {
          status: 400,
        }
      );
    }

    const videoData = {
      ...reqBody,
      controls: reqBody.controls ? false : true,
      videoAttributes: {
        height: 1920,
        width: 1080,
        quality: reqBody.videoAttributes?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo);
  } catch (error) {
    return NextResponse.json(
      { errorDescription: "Failed to create a video" },
      {
        status: 500,
      }
    );
  }
}
