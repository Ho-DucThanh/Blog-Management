export default function Dash_DashBoard() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden py-6 sm:py-2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold sm:text-3xl lg:text-5xl">
            Welcome to My Blog
          </h1>
          <p className="text-sm text-gray-500 sm:text-base">
            Here, you will find many articles and guides on topics such as
            technology, life, travel, culture and many other topics...
          </p>
        </div>

        <div className="relative my-8 sm:my-10">
          <div className="overflow-hidden rounded-lg">
            <img
              src="https://bizflyportal.mediacdn.vn/bizflyportal/1396/2428/2021/04/26/17/17/blo16194106288091.jpg"
              alt="Blog Banner"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <h2 className="px-4 text-center text-xl font-bold text-white sm:text-2xl md:text-3xl lg:text-4xl">
                Share your blog with everyone
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
