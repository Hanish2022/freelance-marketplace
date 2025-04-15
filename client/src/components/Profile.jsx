import React, { useEffect, useState } from "react";
import { useProfileStore } from "../store/profileStore";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";

const Profile = () => {
  const { userProfile, fetchUserProfile, updateUserProfile } = useProfileStore();
  const { logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    skills: [],
    bio: "",
    location: "",
    portfolio: [],
  });
  const [newSkill, setNewSkill] = useState("");
  const [newPortfolioUrl, setNewPortfolioUrl] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await fetchUserProfile();
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        skills: userProfile.skills || [],
        bio: userProfile.bio || "",
        location: userProfile.location || "",
        portfolio: userProfile.portfolio || [],
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleAddPortfolioUrl = () => {
    if (newPortfolioUrl.trim() && !formData.portfolio.includes(newPortfolioUrl.trim())) {
      setFormData((prev) => ({
        ...prev,
        portfolio: [...prev.portfolio, newPortfolioUrl.trim()],
      }));
      setNewPortfolioUrl("");
    }
  };

  const handleRemovePortfolioUrl = (urlToRemove) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((url) => url !== urlToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.href = "/login"}
          className="bg-green-500 text-gray-900 px-4 py-2 rounded hover:bg-green-400"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <p className="text-gray-400 mb-4">No profile data available</p>
        <button
          onClick={() => window.location.href = "/login"}
          className="bg-green-500 text-gray-900 px-4 py-2 rounded hover:bg-green-400"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-100">Profile</h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-500 text-gray-900 px-4 py-2 rounded hover:bg-green-400"
              >
                Edit Profile
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-700 text-gray-300 px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 text-gray-900 px-4 py-2 rounded hover:bg-green-400"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500 focus:ring-green-500"
                />
              ) : (
                <p className="mt-1 text-lg text-gray-100">{userProfile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">Email</label>
              <p className="mt-1 text-lg text-gray-100">{userProfile.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">Skills</label>
              {isEditing ? (
                <div className="mt-2">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      className="flex-1 rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500 focus:ring-green-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="bg-green-500 text-gray-900 px-4 py-2 rounded hover:bg-green-400"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {userProfile.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500 focus:ring-green-500"
                />
              ) : (
                <p className="mt-1 text-gray-100">{userProfile.bio || "No bio available"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500 focus:ring-green-500"
                />
              ) : (
                <p className="mt-1 text-gray-100">{userProfile.location || "Location not specified"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">Portfolio</label>
              {isEditing ? (
                <div className="mt-2">
                  <div className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={newPortfolioUrl}
                      onChange={(e) => setNewPortfolioUrl(e.target.value)}
                      placeholder="Add a portfolio URL"
                      className="flex-1 rounded-md bg-gray-700 border-gray-600 text-gray-100 focus:border-green-500 focus:ring-green-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddPortfolioUrl}
                      className="bg-green-500 text-gray-900 px-4 py-2 rounded hover:bg-green-400"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.portfolio.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-700 p-2 rounded"
                      >
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 flex-1"
                        >
                          {url}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemovePortfolioUrl(url)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-2 space-y-2">
                  {userProfile.portfolio?.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-green-400 hover:text-green-300"
                    >
                      {url}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </form>

          <div className="mt-8 flex justify-end">
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
