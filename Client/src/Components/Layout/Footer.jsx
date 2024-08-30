import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
export default function FooterCom() {
  return (
    <div className="relative">
      <Footer
        container
        className="fixed bottom-0 h-20 w-40 rounded-none border border-t-8 border-teal-500"
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid w-full justify-between sm:flex md:grid-cols-1">
            <div className="mt-4">
              <Link
                to="/"
                className="self-center whitespace-nowrap text-lg font-semibold sm:text-xl dark:text-white"
              >
                <span className="rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-2 py-1 text-white">
                  Course
                </span>{" "}
                Learning
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
              <div>
                <Footer.Title title="About" />
              </div>
              <div>
                <Footer.Title title="Follow us" />
              </div>
              <div>
                <Footer.Title title="Legal" />
              </div>
            </div>
          </div>
        </div>
      </Footer>
    </div>
  );
}
