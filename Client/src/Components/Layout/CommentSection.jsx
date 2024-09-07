import React, { useState, useEffect } from "react";
import { Alert, Button } from "flowbite-react";
import {
  createComment,
  getCommentsByPostId,
  likeComment,
  deleteComment,
} from "../../Redux/Commet/Comment_apiRequest";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Comment from "./Comment";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function CommentSection({ postId }) {
  const { currentUser, accessToken } = useSelector((state) => state.auth.login);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const MAX_CHARS = 200;
  const isMaxLengthReached = content.length >= MAX_CHARS;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await getCommentsByPostId(accessToken, postId);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    if (accessToken) {
      fetchComments();
    } else {
      navigate("/login");
    }
  }, [accessToken, postId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.length > MAX_CHARS) {
      setError("Content must be less than 200 characters");
      return;
    }
    if (content.trim() === "") return;
    setIsLoading(true);
    setError(null);
    try {
      const newComment = await createComment(
        accessToken,
        postId,
        currentUser._id,
        content,
        setError,
      );
      setComments([...comments, newComment]);
      setContent("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (commentId, updatedComment) => {
    setComments(
      comments.map((comment) =>
        comment._id === commentId ? updatedComment : comment,
      ),
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      await deleteComment(accessToken, commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      setError(error.message);
      console.error("Failed to delete comment:", error);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const data = await likeComment(accessToken, commentId);
      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: data.likes,
                numberOfLikes: data.likes.length,
              }
            : comment,
        ),
      );
    } catch (error) {
      setError(error.message);
      console.error("Failed to like comment:", error);
    }
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    if (newContent.length <= MAX_CHARS) {
      setContent(newContent);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl p-3">
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="rounded-md border border-teal-500 p-3"
        >
          <textarea
            placeholder="Add a comment..."
            rows="3"
            value={content}
            onChange={handleContentChange}
            className={`mb-2 w-full resize-none rounded-lg border border-gray-300 p-2 text-sm text-gray-900 focus:border-blue-300 focus:ring-blue-300 ${
              isMaxLengthReached ? "border-red-500" : ""
            }`}
          />
          <div className="mt-2 flex items-center justify-between">
            <p
              className={`text-xs ${isMaxLengthReached ? "font-bold text-red-500" : "text-gray-500"}`}
            >
              {MAX_CHARS - content.length} characters remaining
            </p>
            <Button
              type="submit"
              disabled={isLoading || content.trim() === ""}
              className="cursor-pointer rounded bg-[#6C7EE1] font-bold text-white hover:bg-[#5A6BC1] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Submit
            </Button>
          </div>
          {isMaxLengthReached && (
            <p className="mt-1 text-xs text-red-500">
              Maximum character limit reached. Please remove some characters to
              continue typing.
            </p>
          )}
          {error && (
            <Alert color="failure" className="mt-3">
              {error}
            </Alert>
          )}
        </form>
      )}
      <div className="my-5 flex items-center gap-1 text-sm">
        <p>Comments</p>
        <div className="rounded-sm border border-gray-400 px-2 py-1">
          <p>{comments.length}</p>
        </div>
      </div>
      {comments.length === 0 ? (
        <p className="text-center text-gray-500">No comments yet</p>
      ) : (
        comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            onEdit={handleEdit}
            onLike={handleLike}
            onDelete={(commentId) => {
              setShowModal(true);
              setCommentToDelete(commentId);
            }}
          />
        ))
      )}

      <Dialog open={showModal} onClose={setShowModal} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-red-600"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Delete Comment
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this comment?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => handleDelete(commentToDelete)}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  Delete
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setShowModal(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
