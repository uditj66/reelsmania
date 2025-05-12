// Centralizing the all front-end APIs call using api-client ,we want to reduce the code of fetch api from each componenets using api-client

import { Ivideo } from "@/app/models/video.model";

/*This line is using TypeScript utility types to create a new type from existing type. Here's what each part means:
INITIALLY,
type Ivideo = {
  _id: string;
  title: string;
  description: string;
  url: string;
};
but after declaring 
1.Omit<Ivideo, "_id">:
This means:"Take all the properties from Ivideo, but leave out _id."
2.export type VideoFormData = ...:
This means:"Create and export a new type called VideoFormData."
SO,NOW
type VideoFormData = {
  title: string;
  description: string;
  url: string;
}

*/
export type VideoFormData = Omit<Ivideo, "_id">;
type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  // Record is a key-value pair
  headers?: Record<string, string>;
  body?: VideoFormData;
};

class ApiClient {
  // <T> stands for type and is used to define a generic type, means myFetchMethod can have generic type means I will decide later when calling the function ,the return type of myFetchMethod(). This method return promise and return type of promise is <T> also generic decides.Basically,we wrote the function once, but it works with any type, and keeps that type info.
  private async myFetchMethod<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", headers = {}, body } = options;
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
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

      body: videoData, // Ensure it's a JSON string
      // headers: { "Content-Type": "application/json" }, // Explicitly set headers
    });
  }
}

// exporting an object called apiClient from the class ApiClient
export const apiClient = new ApiClient();
