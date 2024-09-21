import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useState, useEffect } from "react";
import { updatePost } from "../../Redux/Post/Post_apiRequest";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdatePost() {
  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const { postId } = useParams();
  const { currentUser, accessToken } = useSelector((state) => state.auth.login);
  const { quill, quillRef } = useQuill();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const response = await fetch(
        `/api/post/getPost?postId=${postId}`,
      );
      if (!response.ok) {
        throw new Error("Cannot get post");
      }
      const data = await response.json();
      console.log(data);
      setFormData(data.posts[0]);
      if (data.posts[0].image) {
        setImage(data.posts[0].image);
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    if (quill && formData.content) {
      quill.clipboard.dangerouslyPasteHTML(formData.content);
    }
  }, [quill, formData.content]);

  const handleInputChange = (e) => {
    const { id, value, files } = e.target;

    if (id === "file-upload" && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      setError("Please provide all required fields");
      return;
    }

    await updatePost(postId, currentUser._id, formData, accessToken, navigate);
  };

  return (
    <div className="mx-auto min-h-screen max-w-3xl p-3">
      <h1 className="my-7 text-center text-3xl font-semibold">Update Post</h1>
      {error && <div className="mb-4 bg-red-100 p-3 text-red-500">{error}</div>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Title"
            id="title"
            value={formData.title || ""}
            required
            className="flex-1 rounded border border-gray-300 p-2"
            onChange={handleInputChange}
          />
          <select
            id="category"
            className="rounded border border-gray-300"
            value={formData.category || "uncategorized"}
            onChange={handleInputChange}
          >
            <option value="Đời sống">Đời sống</option>
            <option value="Công Nghệ">Công Nghệ</option>
            <option value="Sức khỏe">Sức khỏe</option>
            <option value="Thể thao">Thể thao</option>
            <option value="Du lịch">Du lịch</option>
          </select>
        </div>
        <div className="flex items-center justify-between gap-4 border-4 border-dotted border-teal-500 p-3">
          <input
            type="file"
            id="file-upload"
            className="rounded bg-gradient-to-r from-purple-400 to-blue-500 px-4 py-2 text-white disabled:opacity-50"
            placeholder="Upload Image"
            onChange={handleInputChange}
          />
        </div>
        {image && (
          <img src={image} alt="upload" className="h-72 w-full object-cover" />
        )}
        <div ref={quillRef} className="mb-12 h-72" />
        <button
          type="submit"
          className="rounded bg-purple-600 px-4 py-2 font-bold text-white hover:bg-purple-700"
        >
          Update
        </button>
      </form>
    </div>
  );
}
