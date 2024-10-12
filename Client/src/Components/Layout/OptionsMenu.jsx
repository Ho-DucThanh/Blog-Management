import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function OptionsMenu({ showOptions, setShowOptions, position }) {
  const optionsRef = useRef(null);

  const handleClickOutside = (e) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target)) {
      setShowOptions(false); // Đóng menu nếu nhấn bên ngoài
    }
  };

  useEffect(() => {
    if (showOptions) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showOptions]);

  return (
    showOptions && (
      <div
        ref={optionsRef}
        style={{
          position: "absolute",
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        className="mt-2 rounded border bg-white shadow-lg"
      >
        <Link
          to="/personal-page"
          className="block px-4 py-2 text-sm hover:bg-gray-100"
        >
          Personal Page
        </Link>
        <Link
          to="/add-friend"
          className="block px-4 py-2 text-sm hover:bg-gray-100"
        >
          Add Friend
        </Link>
        <Link
          to="/message"
          className="block px-4 py-2 text-sm hover:bg-gray-100"
        >
          Send Message
        </Link>
      </div>
    )
  );
}
