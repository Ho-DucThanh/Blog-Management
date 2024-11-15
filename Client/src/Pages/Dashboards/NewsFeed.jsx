import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserNewsFeed } from "../../Redux/Page/Follow_Api";
import CommentSection from "../../Components/Layout/CommentSection";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";

export default function NewsFeed() {
  const { id } = useParams();
  const [newsFeed, setNewsFeed] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserNewsFeed(id);
      setNewsFeed(data);
    };
    fetchData();
  }, [id]);

  return (
    <div className="mx-auto mt-6 max-w-3xl rounded-lg bg-white p-6 shadow-lg">
      {/* Post Section */}
      <div className="mt-4 space-y-6">
        {newsFeed.length > 0 ? (
          newsFeed.map((post) => (
            <div
              key={post._id}
              className="transform rounded-lg border border-gray-300 bg-gray-50 p-4 shadow-md transition-transform hover:scale-105"
            >
              {/* Hiển thị avatar và userName */}
              <div className="flex items-center space-x-3">
                <a
                  href={`/personal-page/${post.userProfile.user_id}`}
                  className="flex items-center space-x-3"
                >
                  <img
                    src={post.userProfile.avatar}
                    alt={`Avatar of ${post.userProfile.userName}`}
                    className="h-12 w-12 rounded-full border-2 border-gray-200 object-cover shadow-md"
                  />
                  <span className="text-lg font-bold text-gray-900">
                    {post.userProfile.userName}
                  </span>
                </a>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(post.updatedAt), {
                    addSuffix: true,
                  })}{" "}
                </span>
              </div>

              <h3 className="mt-2 text-2xl font-semibold text-gray-900">
                {post.title}
              </h3>

              {/* Hình ảnh */}
              {post.image && (
                <div className="mt-3 overflow-hidden rounded-lg">
                  <img
                    src={post.image}
                    alt="Post Image"
                    className="w-full rounded-lg object-cover"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
              )}

              {/* Nội dung */}
              <div
                className="mt-4 text-sm leading-relaxed text-gray-800"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Thông tin bình luận và lượt thích */}
              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <ChatBubbleOvalLeftIcon className="h-5 w-5 text-gray-500" />
                  <span>{post.comments?.length || 0} Bình luận</span>
                </div>
              </div>

              {/* Comment Section */}
              <div className="mt-4">
                <CommentSection postId={post._id} comments={post.comments} />
              </div>
            </div>
          ))
        ) : (
          <p className="mt-2 text-center text-gray-500">
            Chưa có bài viết nào.
          </p>
        )}
      </div>
    </div>
  );
}
