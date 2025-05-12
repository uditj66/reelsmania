"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "lucide-react";
import { useNotification } from "./Notifications";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/");
    } catch (error) {
      return NextResponse.json(
        {
          errorMessage: error,
        },
        { status: 500 }
      );
      // throw new Error("ERROR OCCURED DUE TO :");
    }
  };

  return (
    <>
      <div className="navbar bg-base-300 sticky top-0 z-40">
        <div className="container mx-auto">
          <div className="flex flex-row px-2 lg:flex-none">
            <Link
              href="/"
              className=""
              prefetch={true}
              onClick={() =>
                showNotification("Welcome to ImageKit ReelsPro", "info")
              }
            >
              <Image
                src={"/logo.png"}
                alt="logo"
                width={150}
                height={100}
                className="rounded-full"
              />
            </Link>
          </div>
          <div className="flex flex-1 justify-end px-2">
            <div className="flex items-stretch gap-2">
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle"
                >
                  <User className="w-5 h-5" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] shadow-lg bg-base-100 rounded-box w-64 mt-4 py-2"
                >
                  {session ? (
                    <>
                      <li className="px-4 py-1">
                        <span className="text-sm opacity-70">
                          Welcome, {session.user?.email?.split("@")[0]}
                        </span>
                      </li>
                      <div className="divider my-1"></div>

                      <li>
                        <Link
                          href="/upload"
                          className="px-4 py-2 hover:bg-base-200 block w-full"
                          onClick={() =>
                            showNotification(
                              "Welcome to Admin Dashboard",
                              "info"
                            )
                          }
                        >
                          Video Upload
                        </Link>
                      </li>

                      <li>
                        <button
                          onClick={handleSignOut}
                          className="px-4 py-2 text-error hover:bg-base-200 w-full text-left"
                        >
                          Sign Out
                        </button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link
                        href="/login"
                        className="px-4 py-2 hover:bg-base-200 block w-full"
                        // #TO- DO
                        onClick={() =>
                          showNotification("Please sign in to continue", "info")
                        }
                      >
                        Login
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
