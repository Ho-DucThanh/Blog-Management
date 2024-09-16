import ChangePassword from "../../Components/Forms/ChangePassword";

export default function ChangePassWordPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-2 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://img.freepik.com/free-vector/school-logo-template_23-2149713033.jpg"
          className="mx-auto h-32 w-auto"
        />
        <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Change your password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <ChangePassword />

        <div className="mt-10 flex justify-between text-sm">
          <div>
            <p className="text-center text-gray-500">
              Make sure your password is valid and remember the changed
              password!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
