import moment from "moment";
import { useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { Button, Textarea } from "flowbite-react";

export default function Comment() {
  // Dữ liệu mẫu cho comment và user
  const comment = {
    _id: "1",
    content: "This is a sample comment.",
    createdAt: "2023-09-01T12:00:00Z",
    userId: "123",
    likes: ["456"],
    numberOfLikes: 1,
  };

  const user = {
    _id: "123",
    username: "sampleuser",
    profilePicture: "https://via.placeholder.com/150",
  };

  const currentUser = {
    _id: "123", // Đặt ID của người dùng hiện tại giống với ID của comment.userId để kiểm tra quyền sửa và xóa
    isAdmin: false,
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Save edited content:", editedContent);
  };

  const handleLike = () => {
    console.log("Like comment with ID:", comment._id);
  };

  const handleDelete = () => {
    console.log("Delete comment with ID:", comment._id);
  };

  return (
    <div className="flex border-b p-4 text-sm dark:border-gray-600">
      <div className="mr-3 flex-shrink-0">
        <img
          className="h-10 w-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center">
          <span className="mr-1 truncate text-xs font-bold">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-xs text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="pb-2 text-gray-500">{comment.content}</p>
            <div className="flex max-w-fit items-center gap-2 border-t pt-2 text-xs dark:border-gray-700">
              <button
                type="button"
                onClick={handleLike}
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
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
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
                      onClick={handleDelete}
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
    </div>
  );
}
