// components/Dashboard.jsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-semibold text-gray-800">
                                Dashboard
                            </span>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700">
                                    Welcome, {user?.username || 'User'}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-4">User Profile</h2>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold">{user?.username}</p>
                                        <p className="text-gray-500">User Account</p>
                                    </div>
                                </div>
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-semibold mb-2">Account Details</h3>
                                    <p className="text-gray-600">
                                        Username: {user?.username}
                                    </p>
                                    <p className="text-gray-600">
                                        Last Login: {new Date().toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;