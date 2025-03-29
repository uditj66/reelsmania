import { Ivideo } from "../models/video.model";

export type videoFormData = Omit<Ivideo, "_id">;
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
    const { method = "GET", headers = {}, body } = options;
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api/${endpoints}`, {
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

  async createVideo(videoData: videoFormData) {
    return this.myFetchMethod(`/videos`, {
      method: "POST",
      body: videoData,
    });
  }
}
export const apiClient = new ApiClient();
