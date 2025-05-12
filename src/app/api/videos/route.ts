import { authOptions } from "@/app/lib/auth";
import { connectDb } from "@/app/lib/dbConfig";
import Video, { Ivideo } from "@/app/models/video.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// api for getting videos from database
export async function GET() {
  try {
    await connectDb();

    //Here lean returns the plain javascript object instead of the mongoose documents.

    /*
    Without .lean(): When you call Video.find({}), Mongoose will return Mongoose documents. These documents are full-fledged Mongoose objects, meaning they have Mongoose-specific methods and features (like .save(), .populate(), etc.).

    With .lean(): When you call Video.find({}).lean(), Mongoose will return an array of plain JavaScript objects that represent the documents. Each index of array have object, which have no Mongoose methods, so they're just the raw data (e.g., a normal JavaScript object or array).
   
   Why use .lean()?
   1.Performance: Returning plain JavaScript objects is faster than returning Mongoose documents because it skips the overhead of attaching Mongoose-specific methods to the documents.

   2.Memory Efficiency: Plain objects take up less memory, which is useful when handling a large number of documents.

   3.Read-Only Operations: If you're only reading data and don't need to modify or interact with the documents (i.e., you don’t need Mongoose methods), .lean() is a good option.
   */
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!videos || videos.length === 0) {
      /* Here we return status of 200 means back-end have requested to database to return array of videos.
      Database have send the array of objects but the colection videos in database have no document  */
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json(
      { errorDescription: "Failed to fetch videos",error },
      { status: 500 }
    );
  }
}

//  api for posting videos in database
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log(session);

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
      !reqBody.videoUrl
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
      controls: reqBody.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: reqBody.transformation?.quality ?? 100,
      },
    };

    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo);
  } catch (error) {
    return NextResponse.json(
      { errorDescription: "Failed to create a video",error },
      {
        status: 500,
      }
    );
  }
}
