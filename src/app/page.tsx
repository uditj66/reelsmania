'use client';

import { useEffect, useState } from "react";
import { Ivideo } from "./models/video.model";
import { apiClient } from "./lib/api-client";
import VideoFeed from "@/app/components/VideoFeed";

export default function Home() {
  const [videos, setVideos] = useState<Ivideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error while fetching videos", error);
      }
      fetchVideos();
    };
  }, []);
  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ImageKit ReelsProMania</h1>
        <VideoFeed videos={videos} />
      </main>
    </>
  );
}
