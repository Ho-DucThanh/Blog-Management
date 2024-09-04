import { Alert, Button, Modal, TextInput, Textarea } from "flowbite-react";
import { Link } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function CommentSection() {
  const currentUser = {
    _id: "1",
    username: "johndoe",
    profilePicture: "https://via.placeholder.com/40",
  };

  const comments = [
    {
      _id: "1",
      content: "This is a sample comment.",
      createdAt: "2024-09-01T12:00:00Z",
      userId: "1",
      username: "johndoe",
      profilePicture: "https://via.placeholder.com/40",
      likes: [],
      numberOfLikes: 0,
    },
    {
      _id: "2",
      content: "Another example comment.",
      createdAt: "2024-09-02T15:30:00Z",
      userId: "2",
      username: "janedoe",
      profilePicture: "https://via.placeholder.com/40",
      likes: [],
      numberOfLikes: 2,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl p-3">
      {currentUser ? (
        <div className="my-5 flex items-center gap-1 text-sm text-gray-500">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 rounded-full object-cover"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="my-5 flex gap-1 text-sm text-teal-500">
          You must be signed in to comment.
          <Link className="text-blue-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form className="rounded-md border border-teal-500 p-3">
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            value="This is a static example."
          />
          <div className="mt-5 flex items-center justify-between">
            <p className="text-xs text-gray-500">200 characters remaining</p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          <Alert color="failure" className="mt-5">
            Example error message.
          </Alert>
        </form>
      )}
      <div className="my-5 flex items-center gap-1 text-sm">
        <p>Comments</p>
        <div className="rounded-sm border border-gray-400 px-2 py-1">
          <p>{comments.length}</p>
        </div>
      </div>
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
      <Modal show={true} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure">Yes, I'm sure</Button>
              <Button color="gray">No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
