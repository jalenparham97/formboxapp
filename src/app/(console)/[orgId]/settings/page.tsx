import { UserProfileForm } from "@/components/settings/user-profile-form";
import { api } from "@/trpc/server";

export default async function SettingsProfilePage() {
  const user = await api.user.getUser.query();

  return (
    <div>
      <div>
        <h2 className="text-lg font-semibold leading-7 text-gray-900">
          Profile
        </h2>
        <p className="mt-1 leading-6 text-gray-600">
          Manage your personal profile details.
        </p>
      </div>

      <div className="mt-6">
        <UserProfileForm initialData={user} />
      </div>
    </div>
  );
}
