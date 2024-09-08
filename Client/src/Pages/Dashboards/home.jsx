import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PostCard from "../../Components/Layout/PostCard";
import { useEffect, useState } from "react";

export default function HomeDashBoard() {
  const [posts, setPosts] = useState([]);
  const { accessToken } = useSelector((state) => state.auth.login);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/post/getPost?limit=4`,
        );
        const data = await response.json();
        if (response.ok) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [accessToken]);
  return (
    <div className="relative isolate min-h-screen overflow-hidden py-6 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold sm:text-3xl lg:text-5xl">
            Welcome to My Blog
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            Here, you will find many articles and guides on topics such as
            technology, life, travel, culture and many other topics...
          </p>
          <Link
            to="/search"
            className="text-sm font-bold text-teal-500 hover:underline sm:text-base"
          >
            View all posts
          </Link>
        </div>

        <div className="relative my-8 sm:my-10">
          <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
            <img
              src="https://bizflyportal.mediacdn.vn/bizflyportal/1396/2428/2021/04/26/17/17/blo16194106288091.jpg"
              alt="Blog Banner"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <h2 className="px-4 text-center text-xl font-bold text-white sm:text-2xl md:text-3xl lg:text-4xl">
                Share your blog with everyone
              </h2>
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-col items-center justify-center">
          {posts && posts.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-center text-2xl font-semibold">
                Recent Posts
              </h2>
              <div className="mt-5 flex flex-wrap justify-center gap-5">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              <Link
                to={"/search"}
                className="text-center text-lg text-teal-500 hover:underline"
              >
                View all posts
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
