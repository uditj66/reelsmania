import { Ivideo } from "@/app/models/video.model";

export type VideoFormData = Omit<Ivideo, "_id">;
type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
};

class ApiClient {
  private async myFetchMethod<T>(
    endpoints: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method="GET", headers = {}, body } = options;
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`api${endpoints}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  }

  async getVideos() {
    return this.myFetchMethod<Ivideo[]>("/videos");
  }
  async getAVideo(id: string) {
    return this.myFetchMethod<Ivideo>(`/videos/${id}`);
  }

  async createVideo(videoData: VideoFormData) {
    return this.myFetchMethod<Ivideo>("/videos", {
      method: "POST",

      body:videoData // Ensure it's a JSON string
      // headers: { "Content-Type": "application/json" }, // Explicitly set headers
    });
  }
}
export const apiClient = new ApiClient();
