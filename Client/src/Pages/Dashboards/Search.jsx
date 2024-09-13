import { FaChevronDown, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PostCard from "../../Components/Layout/PostCard";
import { getAllPost } from "../../Redux/Post/Post_apiRequest";

export default function Search() {
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    category: "",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useSelector((state) => state.auth.login);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || categoryFromUrl) {
      setSearchData({
        searchTerm: searchTermFromUrl || "",
        category: categoryFromUrl || "",
      });
      fetchPost(searchTermFromUrl, categoryFromUrl);
    } else {
      fetchAllPost();
    }
  }, [location.search]);

  const fetchPost = async (searchTerm, category) => {
    setLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      if (searchTerm) searchParams.set("searchTerm", searchTerm);
      if (category && category !== "all")
        searchParams.set("category", category);
      const res = await fetch(
        `http://localhost:3000/api/post/getPost?${searchParams.toString()}`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await res.json();
      console.log(data);
      setPosts(data.posts);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPost = async () => {
    try {
      const res = await getAllPost(accessToken);
      setPosts(res);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (searchData.searchTerm)
      urlParams.set("searchTerm", searchData.searchTerm);
    if (searchData.category) urlParams.set("category", searchData.category);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSearchData({ ...searchData, category, searchTerm: "" });
    const urlParams = new URLSearchParams();
    if (category) urlParams.set("category", category);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <div>
      <div className="mx-auto my-5 max-w-lg">
        <form onSubmit={handleSearch} className="flex">
          <div className="relative">
            <select
              id="category"
              value={searchData.category}
              onChange={handleCategoryChange}
              className="z-10 inline-flex flex-shrink-0 appearance-none items-center rounded-s-lg border border-gray-300 bg-white px-4 py-2.5 pr-8 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:border-gray-500 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="Đời sống">Đời sống</option>
              <option value="Công Nghệ">Công Nghệ</option>
              <option value="Sức khỏe">Sức khỏe</option>
              <option value="Thể thao">Thể thao</option>
              <option value="Du lịch">Du lịch</option>
            </select>
            <FaChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative w-full">
            <input
              type="search"
              id="search-dropdown"
              className="z-20 block w-full rounded-e-lg border border-s-2 border-gray-300 border-s-gray-50 bg-white p-2.5 text-sm text-gray-900"
              placeholder="Search with title..."
              required
              value={searchData.searchTerm}
              onChange={(e) =>
                setSearchData({
                  ...searchData,
                  searchTerm: e.target.value,
                  category: "",
                })
              }
            />
            <button
              type="submit"
              className="absolute end-0 top-0 h-full rounded-e-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none"
            >
              <FaSearch className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
      <div className="mb-5 flex flex-col items-center justify-center">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500"> Error: {error}</p>}
        {posts.length === 0 && <p>No posts found</p>}
        <div className="mt-5 flex flex-wrap justify-center gap-5">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
