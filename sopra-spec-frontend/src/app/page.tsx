"use client";

import { useAuth } from "@/utils/auth-provider";
import { getBackendUrl } from "@/utils/get-backend-url";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated, logout } = useAuth(); // grab logout from provider

  const handleLogout = async () => {
    try {
      // call backend logout
      await axios.post(getBackendUrl("/auth/logout"));

      // clear local tokens + user state
      logout();

      alert("Logged out successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <h1>Welcome Authenticated User!</h1>
          <button
            className="bg-amber-200 hover:cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <h1>You are not logged in</h1>
          <button>
            <Link href="/auth/login">Login Here</Link>
          </button>
        </>
      )}
    </div>
  );
}
