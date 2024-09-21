import { Button } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import PostCard from "../../Components/Layout/PostCard";
import { useSelector, useDispatch } from "react-redux";
import { getAllProfiles } from "../../Redux/Home/Profile_apiRequest";
import CommentSection from "../../Components/Layout/CommentSection";
export default function ViewPost() {
  const { postSlug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [recentPosts, setRecentPosts] = useState(null);
  const { currentUser, accessToken } = useSelector((state) => state.auth.login);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/post/getPost?slug=${postSlug}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setPost(data.posts[0]);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await fetch(`/api/post/getPost?limit=6`);
        const data = await response.json();
        if (response.ok) {
          setRecentPosts(data.posts);
        }
        console.log(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchRecentPosts();
  }, []);

  useEffect(() => {
    const fetchUserProfiles = async () => {
      if (post && post.user_id) {
        try {
          const profileData = await getAllProfiles(
            accessToken,
            dispatch,
            setError,
          );
          const authorProfile = profileData.find(
            (profile) => profile.user_id === post.user_id,
          );
          if (authorProfile) {
            setAuthor({
              userName: authorProfile.userName,
              avatar: authorProfile.avatar,
            });
          }
          console.log(post);
        } catch (err) {
          setError(err.message);
        }
      }
    };

    fetchUserProfiles();
  }, [post, accessToken, dispatch]);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col p-3">
      <div className="ml-3 mt-5 flex items-center gap-2">
        <img
          src={author && author.avatar}
          alt={author && author.userName}
          className="h-10 w-10 rounded-full object-cover"
        />
        <span>{author && author.userName}</span>
      </div>
      <h1 className="mx-auto max-w-2xl p-3 text-center font-serif text-3xl lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="mt-5 self-center"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="mt-10 max-h-[600px] w-full object-cover p-3"
      />
      <div className="mx-auto flex w-full max-w-2xl justify-between border-b border-slate-500 p-3 text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="post-content mx-auto w-full max-w-2xl p-3"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>

      {post && <CommentSection postId={post._id} />}

      <div className="mb-5 flex flex-col items-center justify-center">
        <h1 className="mt-5 text-xl">Recent articles</h1>
        <div className="mt-5 flex flex-wrap justify-center gap-5">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </main>
  );
}
