"use client";

import { ImageKitProvider } from "imagekitio-next";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./Notifications";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY!;
console.log(urlEndpoint);
console.log(publicKey);

export default function Providers({ children }: { children: React.ReactNode }) {
  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit-auth");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      console.log(data);

      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(` Imagekit Authentication request failed: ${error}}`);
    }
  };
  return (
    <SessionProvider>
      <NotificationProvider>
        <ImageKitProvider
          urlEndpoint={urlEndpoint}
          publicKey={publicKey}
          authenticator={authenticator}
        >
          {children}
        </ImageKitProvider>
      </NotificationProvider>
    </SessionProvider>
  );
}
