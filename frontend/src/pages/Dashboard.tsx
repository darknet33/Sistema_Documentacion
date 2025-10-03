// src/pages/Dashboard.tsx
import { Sidebar } from '../components';

const Dashboard = () => {
    return (
        <div className="min-h-screen flex bg-gray-50">
            <Sidebar />

            <main className="flex-1 p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Dashboard
                </h1>
            </main>
        </div>
    );
};

export default Dashboard;
