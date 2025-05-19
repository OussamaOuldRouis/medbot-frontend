import Chat from "@/components/Chat";
import RecentInteractions from "@/components/RecentInteractions";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 h-[calc(100vh-7rem)]">
        <Chat />
      </div>
      
      <div className="md:col-span-1 h-[calc(100vh-7rem)] overflow-auto">
        <RecentInteractions />
      </div>
    </div>
  );
};

export default Dashboard;
