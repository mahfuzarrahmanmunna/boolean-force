import React from 'react';

const AdminPage = () => {
    return (
        <div>
            <main className="p-4">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">Users</h2>
                        <p>Manage system users</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">Content</h2>
                        <p>Manage site content</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-lg font-semibold mb-2">Settings</h2>
                        <p>System configuration</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;