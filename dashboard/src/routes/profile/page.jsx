import React, { useContext } from "react";
import { ThemeProviderContext } from "@/contexts/theme-context";

export default function ProfilePage() {
  const { theme } = useContext(ThemeProviderContext);
  // Compact user profile card, centered, no scroll needed
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[calc(90vh-60px)] 
        ${theme === "dark" ? "bg-slate-900" : "bg-gray-50"}`}
    >
      <div className={`rounded-xl shadow-lg p-6 w-full max-w-xs mt-8 
        ${theme === "dark" ? "bg-slate-800" : "bg-white"}`}
      >
        <div className="flex flex-col items-center mb-4">
          <img
            src="https://ui-avatars.com/api/?name=User+Name&background=5D5FEE&color=fff&size=80"
            alt="User Avatar"
            className="w-20 h-20 rounded-full border-2 border-blue-500 mb-2"
          />
          <h2 className={`text-lg font-bold mb-0.5 ${theme === "dark" ? "text-slate-50" : "text-slate-900"}`}>User Name</h2>
          <p className={`text-xs ${theme === "dark" ? "text-slate-300" : "text-slate-500"}`}>user@email.com</p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className={`font-medium ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>Role:</span>
            <span className={`${theme === "dark" ? "text-slate-300" : "text-slate-500"}`}>User</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`font-medium ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>Joined:</span>
            <span className={`${theme === "dark" ? "text-slate-300" : "text-slate-500"}`}>May 2025</span>
          </div>
        </div>
        <button className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-3 rounded-lg text-sm transition-colors">Edit Profile</button>
      </div>
    </div>
  );
}
