import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';

const Profile = () => {
  const { user, logout } = useAuth();

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <DashboardLayout>
      <section className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">Profile</h1>
        <p className="text-sm text-[#6B7280] mt-1">Your account details.</p>
      </section>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#EC4899] text-white flex items-center justify-center text-xl font-semibold">
            {initials}
          </div>
          <div>
            <p className="text-lg font-semibold text-[#111827]">{user?.name}</p>
            <p className="text-sm text-[#6B7280]">{user?.email}</p>
          </div>
        </div>

        <Button variant="destructive" onClick={logout}>
          Log Out
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
