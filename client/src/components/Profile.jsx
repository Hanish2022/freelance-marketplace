import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileStore } from "../store/profileStore";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { authUser, isLoggedIn } = useAuthStore();
  const { userProfile, fetchUserProfile, updateUserProfile } =
    useProfileStore();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({
    name: "",
    skills: "",
  });

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  // Populate form with user profile data
  useEffect(() => {
    if (userProfile) {
      setUpdatedProfile({
        name: userProfile.name || "",
        skills: userProfile.skills?.join(", ") || "",
      });
    }
  }, [userProfile]);
    
const handleSaveAndExit = async () => {
  await handleUpdate(); // ✅ Save the updated data
  setIsEditing(false); // ✅ Exit edit mode after saving
};
  // Handle profile update
 const handleUpdate = async () => {
   const updatedData = {
     name: updatedProfile.name,
     skills: updatedProfile.skills.split(",").map((skill) => skill.trim()),
   };

   const success = await updateUserProfile(updatedData);
   if (success) {
     // ✅ Update the profile state with new data
     fetchUserProfile(); // Refetch profile from backend to ensure updated data

     // ✅ Exit edit mode and return to view mode
     setIsEditing(false);
   }
 };



  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-gray-100 p-6">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-gray-100 p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>

        {!isEditing ? (
          // Display profile information
          <div className="space-y-4">
            <p>
              <strong>Name:</strong> {userProfile.name}
            </p>
            <p>
              <strong>Email:</strong> {userProfile.email}
            </p>
            <p>
              <strong>Skills:</strong> {userProfile.skills.join(", ")}
            </p>
            <p>
              <strong>Portfolio:</strong>{" "}
              {userProfile.portfolio.length > 0 ? (
                <a
                  href={userProfile.portfolio[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 underline hover:text-green-400"
                >
                  View Portfolio
                </a>
              ) : (
                "Not uploaded"
              )}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 w-full bg-green-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-green-400 transition"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          // Edit profile form
          <div className="space-y-4">
            <input
              type="text"
              value={updatedProfile.name}
              onChange={(e) =>
                setUpdatedProfile({ ...updatedProfile, name: e.target.value })
              }
              placeholder="Name"
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              value={updatedProfile.skills}
              onChange={(e) =>
                setUpdatedProfile({ ...updatedProfile, skills: e.target.value })
              }
              placeholder="Skills (comma-separated)"
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex gap-4">
              {/* <button
                onClick={handleUpdate}
                className="mt-4 w-full bg-green-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-green-400 transition"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="mt-4 w-full bg-gray-500 text-gray-100 font-semibold py-3 rounded-lg hover:bg-gray-600 transition"
              >
                back
              </button> */}
              <button
                onClick={handleSaveAndExit}
                className="mt-4 w-full bg-green-500 text-gray-900 font-semibold py-3 rounded-lg hover:bg-green-400 transition"
              >
                Save & exit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
