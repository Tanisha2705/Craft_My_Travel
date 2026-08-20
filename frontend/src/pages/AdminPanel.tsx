import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  is_admin: boolean;
  date_joined: string;
  last_login: string | null;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [loadError, setLoadError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
      setLoadError('');
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setLoadError('You must be logged in as an admin to view this page.');
      } else {
        setLoadError('Failed to fetch users. Is the backend running?');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditedUser({ name: user.name, email: user.email });
  };

  const handleSave = async (userId: number) => {
    try {
      await api.put(`/admin/users/${userId}`, editedUser);
      await fetchUsers();
      setEditingUserId(null);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      await fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleToggleAdmin = async (userId: number) => {
    try {
      await api.post(`/admin/users/${userId}/toggle-admin`, {});
      await fetchUsers();
    } catch (err) {
      console.error('Failed to toggle admin:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-navy-900 to-blue-900 text-white">
      <Navbar />

      <main className="flex-grow p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

        {loading && <p className="text-center text-gray-300">Loading users...</p>}
        {loadError && (
          <p className="text-center text-red-300 bg-red-500/10 border border-red-400/30 rounded-lg py-3 max-w-lg mx-auto">
            {loadError}
          </p>
        )}

        {!loading && !loadError && (
          <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-xl">
            <table className="w-full text-left">
              <thead className="bg-white/10 text-sm uppercase tracking-wide text-gray-300">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Username</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Admin</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4">Last Login</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-white/10">
                    <td className="p-4">{user.id}</td>
                    <td className="p-4">{user.username}</td>
                    <td className="p-4">
                      {editingUserId === user.id ? (
                        <input
                          value={editedUser.name || ''}
                          onChange={(e) => setEditedUser((prev) => ({ ...prev, name: e.target.value }))}
                          className="bg-white text-gray-900 rounded px-2 py-1 w-full"
                        />
                      ) : (
                        user.name
                      )}
                    </td>
                    <td className="p-4">
                      {editingUserId === user.id ? (
                        <input
                          value={editedUser.email || ''}
                          onChange={(e) => setEditedUser((prev) => ({ ...prev, email: e.target.value }))}
                          className="bg-white text-gray-900 rounded px-2 py-1 w-full"
                        />
                      ) : (
                        user.email
                      )}
                    </td>
                    <td className="p-4">{user.is_admin ? '✅' : '—'}</td>
                    <td className="p-4 text-sm text-gray-300">{user.date_joined}</td>
                    <td className="p-4 text-sm text-gray-300">{user.last_login || 'Never'}</td>
                    <td className="p-4 space-x-2 whitespace-nowrap">
                      {editingUserId === user.id ? (
                        <button
                          onClick={() => handleSave(user.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleToggleAdmin(user.id)}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded"
                      >
                        {user.is_admin ? 'Demote' : 'Promote'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminPanel;
