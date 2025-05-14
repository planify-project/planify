import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const Profile = ({ onBack }) => {
  const { user, logout, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      // Only update name if not empty, otherwise pass undefined
      const nameToUpdate = displayName.trim() !== "" ? displayName : undefined;
      // Only update image if a file is selected, otherwise pass undefined
      const imageToUpdate = imageFile ? imageFile : undefined;
      await updateUserProfile(nameToUpdate, imageToUpdate);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile.");
    }
    setIsLoading(false);
    navigate("/dashboard"); 
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center justify-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow border-0 rounded-4">
              <div className="card-body p-5">
                <div className="d-flex flex-column align-items-center mb-4">
                  <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mb-3" style={{ width: 96, height: 96, overflow: "hidden" }}>
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span className="fs-1 text-white fw-bold">
                        {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <h3 className="mb-1">{user?.displayName || "User"}</h3>
                  <div className="text-muted mb-2">{user?.email}</div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger w-50 mt-2"
                    type="button"
                  >
                    Logout
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="mb-3">
                  <h5 className="mb-3">Edit Profile</h5>
                  <div className="mb-3">
                    <label className="form-label">Display Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Profile Picture</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={user?.email || ""}
                      disabled
                    />
                  </div>
                  {error && <div className="alert alert-danger py-2">{error}</div>}
                  {success && <div className="alert alert-success py-2">{success}</div>}
                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
                {onBack && (
                  <button
                    className="btn btn-link w-100 mt-2"
                    onClick={onBack}
                  >
                    Back to Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
