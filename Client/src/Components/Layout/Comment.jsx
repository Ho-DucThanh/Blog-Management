import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { editComment } from "../../Redux/Comment/Comment_apiRequest";
import moment from "moment";
import OptionsMenu from "./OptionsMenu";

export default function Comment({
  comment,
  onLike,
  onEdit,
  onDelete,
  activeCommentId,
  setActiveCommentId,
}) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [error, setError] = useState(null);
  const { accessToken, currentUser } = useSelector((state) => state.auth.login);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `/api/getUserProfileById/${comment.user_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const data = await response.json();
        if (response.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUserProfile();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const updatedComment = await editComment(
        accessToken,
        comment._id,
        editedContent,
      );
      if (updatedComment) {
        onEdit(comment._id, updatedComment); // Sử dụng updatedComment từ server
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    const rect = e.target.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY - 70, // Vị trí từ phía trên cửa sổ
      left: rect.left + window.scrollX - 130, // Vị trí từ bên trái cửa sổ
    });
    setActiveCommentId(comment._id);
  };

  return (
    <div className="flex border-b p-4 text-sm dark:border-gray-200">
      <div className="mr-3 flex-shrink-0">
        <img
          className="h-10 w-10 rounded-full bg-gray-200 object-cover hover:cursor-pointer"
          src={user.avatar}
          alt={user.userName}
          onClick={handleImageClick}
        />
      </div>

      {activeCommentId === comment._id && (
        <OptionsMenu
          commentUserId={user.user_id}
          showOptions={activeCommentId === comment._id}
          setShowOptions={() => setActiveCommentId(null)}
          position={menuPosition}
        />
      )}

      <div className="flex-1">
        <div className="mb-1 flex items-center">
          <span className="mr-1 truncate text-xs font-bold">
            {user ? `@${user.userName}` : "anonymous user"}
          </span>
          <span className="text-xs text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <textarea
              className="mb-2 w-full resize-none rounded-lg border border-gray-300 p-2 text-sm text-gray-900 focus:border-blue-300 focus:ring-blue-300"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={handleSave}
                className="py-2 text-blue-400"
              >
                Save
              </button>
              <button
                type="button"
                className="py-2 text-red-400"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="pb-2 text-gray-500">{comment.content}</p>
            <div className="flex max-w-fit items-center gap-2 border-t pt-2 text-xs dark:border-gray-200">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  comment.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-gray-400">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              {currentUser &&
                (currentUser._id === comment.user_id || currentUser.admin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-gray-400 hover:text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(comment._id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
