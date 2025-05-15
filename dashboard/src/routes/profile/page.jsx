import React, { useContext, useRef, useState } from "react";
import { ThemeProviderContext } from "@/contexts/theme-context";
import { AuthContext } from "../../contexts/AuthContext.jsx";

const ProfilePage = () => {
    const { theme } = useContext(ThemeProviderContext);
    const { user, updateUserProfile } = useContext(AuthContext);

    // Fallbacks for missing user data
    const displayName = user?.displayName || "User Name";
    const email = user?.email || "user@email.com";
    const photoURL = user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=5D5FEE&color=fff&size=80`;
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(displayName);
    const [image, setImage] = useState(photoURL);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();

    const handleEdit = () => setEditing(true);
    const handleCancel = () => {
        setEditing(false);
        setName(displayName);
        setImage(photoURL);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        let imageFile = fileInputRef.current?.files[0] || null;
        try {
            await updateUserProfile(name, imageFile);
            setEditing(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex min-h-[calc(90vh-60px)] flex-col items-center justify-center ${theme === "dark" ? "bg-slate-900" : "bg-gray-50"}`}>
            <div className={`mt-8 w-full max-w-xs rounded-xl p-6 shadow-lg ${theme === "dark" ? "bg-slate-800" : "bg-white"}`}>
                <div className="mb-4 flex flex-col items-center">
                    <div className="relative">
                        <img
                            src={editing ? image : photoURL}
                            alt="User Avatar"
                            className="mb-2 h-20 w-20 rounded-full border-2 border-blue-500 object-cover"
                        />
                        {editing && (
                            <button
                                type="button"
                                className="absolute bottom-2 right-2 rounded-full bg-blue-500 p-1 text-xs text-white hover:bg-blue-600"
                                onClick={() => fileInputRef.current.click()}
                                aria-label="Change profile picture"
                            >
                                ✎
                            </button>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>
                    {editing ? (
                        <input
                            className={`mt-2 w-full rounded px-2 py-1 text-center text-lg font-bold ${theme === "dark" ? "bg-slate-700 text-slate-50" : "bg-gray-100 text-slate-900"}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            maxLength={40}
                        />
                    ) : (
                        <h2 className={`mb-0.5 text-lg font-bold ${theme === "dark" ? "text-slate-50" : "text-slate-900"}`}>{displayName}</h2>
                    )}
                    <p className={`text-xs ${theme === "dark" ? "text-slate-300" : "text-slate-500"}`}>{email}</p>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span className={`font-medium ${theme === "dark" ? "text-slate-200" : "text-slate-700"}`}>Joined:</span>
                        <span className={`${theme === "dark" ? "text-slate-300" : "text-slate-500"}`}>
                            {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "May 2025"}
                        </span>
                    </div>
                </div>
                {editing ? (
                    <form
                        onSubmit={handleSave}
                        className="mt-6 flex gap-2"
                    >
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="flex-1 rounded-lg bg-gray-300 px-3 py-1.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-gray-400 disabled:opacity-60"
                        >
                            Cancel
                        </button>
                    </form>
                ) : (
                    <button
                        className="mt-6 w-full rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                        onClick={handleEdit}
                    >
                        Edit Profile
                    </button>
                )}
            </div>
        </div>
    );
}
 export default ProfilePage;