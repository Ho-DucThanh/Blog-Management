import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  UsersIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  StarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { getAllUsersProfileNotAdmin } from "../../Redux/Home/Profile_apiRequest";
import { getAllPost } from "../../Redux/Post/Post_apiRequest";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
);

export default function Dash_DashBoard() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [postsByCategory, setPostsByCategory] = useState([]);
  const { accessToken } = useSelector((state) => state.auth.login);
  const [error, setError] = useState(null);
  const [mostFrequentCategories, setMostFrequentCategories] = useState([]);

  const [categoryCount, setCategoryCount] = useState({});
  const [topPosts, setTopPosts] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profileData = await getAllUsersProfileNotAdmin(
          accessToken,
          setError,
        );
        setUsers(profileData);
        console.log(profileData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProfiles();
  }, [accessToken]);

  useEffect(() => {
    const fetchPosts = async () => {
      const postData = await getAllPost(accessToken);
      setPosts(postData);
    };
    fetchPosts();
  }, [accessToken]);

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      const postCategoryData = await fetch("/api/post/getPostByCategory");
      const data = await postCategoryData.json();
      setPostsByCategory(data);
      setMostFrequentCategories(data.mostFrequentCategories);
      setCategoryCount(data.categoryCount);
    };
    fetchPostsByCategory();
  }, [accessToken]);

  useEffect(() => {
    const fetchTopPosts = async () => {
      const topPostsData = await fetch("/api/post/getTopPosts");
      const data = await topPostsData.json();
      setTopPosts(data);
    };
    fetchTopPosts();
  }, [accessToken]);

  const chartData = {
    labels: Object.keys(categoryCount),
    datasets: [
      {
        label: "Số lượng bài viết",
        data: Object.values(categoryCount),
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.2,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 0.5,
        },
      },
    },
  };

  return (
    <div className="relative isolate min-h-screen overflow-hidden py-6 sm:py-2">
      {/* Thống kê */}
      <div className="my-1">
        <h3 className="mb-2 ml-6 text-2xl font-bold">Thống kê</h3>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center rounded bg-white p-4 shadow">
            <UsersIcon className="mr-4 h-12 w-12 rounded-full bg-orange-100 p-2 text-orange-500" />{" "}
            <div>
              <h4 className="font-semibold text-gray-600">Số lượng User</h4>
              <p className="text-xl font-bold text-gray-950">
                {users ? users.length : 0}
              </p>
            </div>
          </div>
          <div className="flex items-center rounded bg-white p-4 shadow">
            <DocumentTextIcon className="mr-4 h-12 w-12 rounded-full bg-gray-200 p-2 text-purple-500" />{" "}
            <div>
              <h4 className="font-semibold text-gray-600">Tổng số bài viết</h4>
              <p className="text-xl font-bold text-gray-950">
                {posts ? posts.length : 0}
              </p>
            </div>
          </div>
          <div className="flex items-center rounded bg-white p-4 shadow">
            <StarIcon className="mr-4 h-12 w-12 rounded-full bg-gray-100 p-2 text-yellow-500" />{" "}
            <div>
              <h4 className="font-semibold text-gray-600">
                Chủ đề được quan tâm nhất
              </h4>
              <p className="font-bold text-gray-800">
                {mostFrequentCategories.join(", ")} {}
              </p>{" "}
            </div>
          </div>
        </div>
      </div>
      {/* Biểu đồ sẽ được thêm vào đây */}

      <div className="my-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="flex-1 rounded-2xl bg-gray-50 p-2 shadow">
          <div className="flex items-center">
            <ChartBarIcon className="h-12 w-12 rounded-full bg-gray-200 p-2 text-gray-900" />
            <h3 className="my-3 ml-4 text-xl font-bold">
              Biểu đồ thống kê bài viết theo chủ đề
            </h3>
          </div>
          <div className="mt-2 h-full w-full">
            <Line
              data={chartData}
              width={400}
              height={300}
              options={chartOptions}
            />
          </div>
        </div>
        <div className="ml-4 flex-1 overflow-auto rounded-2xl bg-gray-50 p-2 shadow">
          <div className="mb-2 flex items-center text-center">
            <ChatBubbleLeftIcon className="mr-4 h-12 w-12 rounded-full bg-orange-100 p-2 text-orange-500" />{" "}
            <h4 className="text-xl font-bold">Các bài viết được chú ý</h4>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {topPosts.map((post) => (
              <div
                key={post._id}
                className="flex items-center rounded-lg bg-white p-4 shadow"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-14 w-14 rounded object-cover"
                />
                <div className="ml-4">
                  <a
                    href={`/post/${post.slug}`}
                    className="font-semibold text-gray-600"
                  >
                    {post.title}
                  </a>
                  <p className="text-gray-500">{post.commentCount} Comments</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
