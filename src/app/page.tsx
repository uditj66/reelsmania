import Image from "next/image";
import { useEffect, useState } from "react";
import { Ivideo } from "./models/video.model";
import { apiClient } from "./lib/api-client";

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
      fetchVideos()
    };
  }, []);
  return <></>;
}
