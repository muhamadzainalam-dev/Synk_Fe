import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import PostCard from "../../components/custom/PostCard";
import { getPosts } from "../../services/getPosts";
import axios from "axios";
import { MdModeEdit } from "react-icons/md";
import { getMedia } from "../../services/getMedia";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

export default function UserProfile() {
  const [isediting, setIsediting] = useState(false);
  const [media, setMedia] = useState(null);
  const [user, setUser] = useState(null);
  const user_Name = useParams();

  const [posts, setPosts] = useState();

  useEffect(() => {
    getPosts().then((e) => {
      const post = e.data.data;

      const myPosts = post.filter((e) => e.user_Name == user_Name.id);

      setPosts(myPosts);
    });
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.post(
        `${SERVER_URI}/getfromusername`,
        { user_Name: user_Name.id },
        { withCredentials: true },
      );

      setUser(response.data);
    };

    fetchUser();
  }, []);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const filename = `${user.user_Name}-${Date.now()}.jpg`;

    try {
      if (file) {
        // Payload
        const payload = {
          filename: filename,
          contentType: file.type,
        };

        // Get Response
        const uploadUrlResponse = await axios.post(
          `${SERVER_URI}/getuploadingurl`,
          payload,
          {
            withCredentials: true,
          },
        );

        // Uploading URL
        const uploadingURL = uploadUrlResponse.data;

        // Put File To The URL
        await axios.put(uploadingURL, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
      }

      const payload = {
        user_Name: user.user_Name,
        mediaKey: filename,
      };

      // Save To DB
      const response = await axios.post(
        `${SERVER_URI}/updatepfmedia`,
        payload,
        {
          withCredentials: true,
        },
      );

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      getMedia(user.media_Key).then((e) => setMedia(e.data));
    }
  }, [user]);

  return (
    <div>
      {/* Center Feed */}
      <div className="md:w-2xl w-full left-0 fixed md:top-20 md:left-1/2 md:-translate-x-1/2 h-full rounded-4xl md:border border-gray-800 md:bg-[#181818] overflow-hidden">
        <div className="h-full overflow-y-auto md:pb-18 pb-30 scrollbar-hide">
          <div className="flex p-4 py-8 md:px-8 items-center">
            <div className="flex-1">
              <div className="text-lg md:text-2xl font-bold">{user?.name}</div>
              <div className="font-light text-gray-400">{user?.user_Name}</div>
            </div>
            <div
              className="relative h-full overflow-hidden"
              onMouseEnter={() => setIsediting(true)}
              onMouseLeave={() => setIsediting(false)}
            >
              <img
                src={user?.media_Key ? media : "/userPlaceholderImage.png"}
                alt=""
                className="w-16 h-16 md:w-26 md:h-26 rounded-full"
              />

              {isediting && (
                <div className="absolute inset-0 rounded-full backdrop-blur-sm flex items-center justify-center">
                  {/* Hidden Input (use absolute and opacity-0 to avoid layout shift) */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="absolute w-0 h-0 opacity-0 pointer-events-none"
                  />

                  {/* Overlay Button */}
                  <button
                    onClick={handleButtonClick}
                    className="absolute inset-0 rounded-full backdrop-blur-sm flex items-center justify-center"
                  >
                    <MdModeEdit className="h-8 w-8 text-black" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-700">
            {/* Center Feed */}
            <div className=" w-full h-full rounded-4xl overflow-hidden">
              <div className="h-full overflow-y-auto md:pb-18 pb-30 scrollbar-hide">
                {posts ? (
                  <>
                    {posts.map((post, i) => (
                      <PostCard key={post.id} post={post} index={i} />
                    ))}
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
