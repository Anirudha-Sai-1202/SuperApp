import { clsx, type ClassValue } from "clsx"
import { useEffect } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchUser() {  
  let data = { user: null };
  try {
    const res = await fetch("http://localhost:3115/check-auth", {
      method: "GET",
      credentials: "include", // important if auth uses cookies/session
    });
    const data = await res.json();
    if (data.logged_in && data.user.email) {
      console.log("Fetched user email:", data['user']['email']);
      return data.user;
    }
  } catch (error) {
    console.error("Error fetching user email:", error);
  }
  return null;
};

export async function isAdmin(): Promise<boolean> {
  const adminEmails = import.meta.env.VITE_ADMIN_EMAIL
    ? import.meta.env.VITE_ADMIN_EMAIL.split(",").map((email) => email.trim())
    : [];
  const user = await fetchUser();
  if (!user) {
    return false;
  }
  const userEmail = user.email;
  console.log("User:", userEmail);
  console.log("Admin Emails:", adminEmails);
  return userEmail ? adminEmails.includes(userEmail) : false;
}

export async function fetchUserEmail() {
  try {
        const res = await fetch("http://localhost:3115/check-auth", {
          method: "GET",
          credentials: "include", // important if auth uses cookies/session
        });
        const data = await res.json();
        console.log("Auth check response:", data);
        if (data.logged_in && data.user.email) {
          console.log("Fetched user email:", data['user']['email']);
          return (data.user.email);
        }
      } catch (error) {
        console.error("Error fetching user email:", error);
        return null;
      }
    };