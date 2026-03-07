import { useEffect, useState } from "react";
import PostCard from "../../components/custom/PostCard";

import { getPosts } from "../../services/getPosts";

export default function Feed() {
  const [posts, setPosts] = useState();

  useEffect(() => {
    getPosts().then((e) => {
      setPosts(e.data.data);
    });
  }, []);

  return (
    <div>
      {/* Center Feed */}
      <div className="md:w-2xl w-full left-0 fixed md:top-20 md:left-1/2 md:-translate-x-1/2 h-full rounded-4xl md:border border-gray-800 md:bg-[#181818] overflow-hidden">
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
  );
}
