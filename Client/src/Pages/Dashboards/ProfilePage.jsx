import React from "react";
import ProfileForm from "../../Components/Forms/ProfileForm";
import Header from "../../Components/Layout/header";

export default function ProfilePage() {
  return (
    <>
      <Header />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Profile</h2>
            <p className="mt-2 text-sm text-gray-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <ProfileForm />
        </div>
      </div>
    </>
  );
}
