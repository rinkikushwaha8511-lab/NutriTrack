import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    FaShieldAlt, FaUsers, FaAppleAlt, FaUtensils, 
    FaTint, FaWeight, FaSearch, FaPlus, FaEdit, FaTrashAlt, 
    FaUserCheck, FaUserSlash, FaFolderPlus, FaTimes 
} from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    // Users state
    const [users, setUsers] = useState([]);
    const [userSearch, setUserSearch] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('all');
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userFormData, setUserFormData] = useState({ name: '', email: '', password: '' });

    // Food Catalog state
    const [foodItems, setFoodItems] = useState([]);
    const [foodSearch, setFoodSearch] = useState('');
    const [foodCategoryFilter, setFoodCategoryFilter] = useState('All Categories');
    const [showFoodModal, setShowFoodModal] = useState(false);
    const [editingFood, setEditingFood] = useState(null);
    const [foodFormData, setFoodFormData] = useState({
        name: '', category: 'Fruits', calories: '', protein: '',
        carbohydrates: '', fats: '', fiber: '', servingSize: '100', servingUnit: 'g'
    });

    // Categories state
    const [categories, setCategories] = useState([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryFormData, setCategoryFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchDashboardData();
        fetchCategories(); // pre-load categories for modals
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const tabParam = queryParams.get('tab');
        if (tabParam && ['overview', 'users', 'foods', 'categories'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [location.search]);

    useEffect(() => {
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'foods') fetchFoodItems();
        if (activeTab === 'categories') fetchCategories();
    }, [activeTab]);

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        navigate(`/admin/dashboard?tab=${tabName}`);
    };

    const showNotification = (type, message) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/dashboard');
            setStats(res.data.stats);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                setError('Access denied. You must be an admin to view this page.');
            } else {
                setError('Failed to load admin dashboard statistics.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            let url = '/admin/users?';
            if (userSearch) url += `search=${encodeURIComponent(userSearch)}&`;
            if (userRoleFilter !== 'all') url += `role=${userRoleFilter}&`;
            
            const res = await api.get(url);
            setUsers(res.data.users || []);
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to fetch users');
        }
    };

    const fetchFoodItems = async () => {
        try {
            let url = '/admin/food-items?';
            if (foodSearch) url += `search=${encodeURIComponent(foodSearch)}&`;
            if (foodCategoryFilter !== 'All Categories') url += `category=${encodeURIComponent(foodCategoryFilter)}&`;

            const res = await api.get(url);
            setFoodItems(res.data.foodItems || []);
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to fetch food items');
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/admin/categories');
            setCategories(res.data.categories || []);
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to fetch categories');
        }
    };

    // User Actions
    const handleToggleUserRole = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        if (!window.confirm(`Are you sure you want to change ${user.name}'s role to ${newRole.toUpperCase()}?`)) return;

        try {
            const res = await api.put(`/admin/users/${user._id}/role`, { role: newRole });
            showNotification('success', res.data.message);
            fetchUsers();
            fetchDashboardData();
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to update user role');
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"? This cannot be undone.`)) return;

        try {
            const res = await api.delete(`/admin/users/${userId}`);
            showNotification('success', res.data.message);
            fetchUsers();
            fetchDashboardData();
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleOpenUserModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setUserFormData({ name: user.name, email: user.email, password: '' });
        } else {
            setEditingUser(null);
            setUserFormData({ name: '', email: '', password: '' });
        }
        setShowUserModal(true);
    };

    const handleSaveUser = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                const res = await api.put(`/admin/users/${editingUser._id}`, {
                    name: userFormData.name,
                    email: userFormData.email
                });
                showNotification('success', res.data.message);
            } else {
                const res = await api.post('/admin/users', userFormData);
                showNotification('success', res.data.message);
            }
            setShowUserModal(false);
            fetchUsers();
            fetchDashboardData();
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to save user');
        }
    };

    // Food Catalog Actions
    const handleOpenFoodModal = (food = null) => {
        if (food) {
            setEditingFood(food);
            setFoodFormData({
                name: food.name,
                category: food.category,
                calories: food.calories,
                protein: food.protein,
                carbohydrates: food.carbohydrates,
                fats: food.fats,
                fiber: food.fiber,
                servingSize: food.servingSize,
                servingUnit: food.servingUnit
            });
        } else {
            setEditingFood(null);
            setFoodFormData({
                name: '',
                category: categories.length > 0 ? categories[0].name : 'Fruits',
                calories: '',
                protein: '',
                carbohydrates: '',
                fats: '',
                fiber: '0',
                servingSize: '100',
                servingUnit: 'g'
            });
        }
        setShowFoodModal(true);
    };

    const handleSaveFoodItem = async (e) => {
        e.preventDefault();
        try {
            if (editingFood) {
                const res = await api.put(`/admin/food-items/${editingFood._id}`, foodFormData);
                showNotification('success', res.data.message);
            } else {
                const res = await api.post('/admin/food-items', foodFormData);
                showNotification('success', res.data.message);
            }
            setShowFoodModal(false);
            fetchFoodItems();
            fetchDashboardData();
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to save food item');
        }
    };

    const handleDeleteFoodItem = async (foodId, foodName) => {
        if (!window.confirm(`Delete "${foodName}" from the master food database?`)) return;

        try {
            const res = await api.delete(`/admin/food-items/${foodId}`);
            showNotification('success', res.data.message);
            fetchFoodItems();
            fetchDashboardData();
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to delete food item');
        }
    };

    // Category Actions
    const handleOpenCategoryModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setCategoryFormData({ name: category.name, description: category.description });
        } else {
            setEditingCategory(null);
            setCategoryFormData({ name: '', description: '' });
        }
        setShowCategoryModal(true);
    };

    const handleSaveCategory = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                const res = await api.put(`/admin/categories/${editingCategory._id}`, categoryFormData);
                showNotification('success', res.data.message);
            } else {
                const res = await api.post('/admin/categories', categoryFormData);
                showNotification('success', res.data.message);
            }
            setShowCategoryModal(false);
            fetchCategories();
            if (activeTab === 'foods') fetchFoodItems();
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to save category');
        }
    };

    const handleDeleteCategory = async (catId, catName) => {
        if (!window.confirm(`Delete category "${catName}"?`)) return;

        try {
            const res = await api.delete(`/admin/categories/${catId}`);
            showNotification('success', res.data.message);
            fetchCategories();
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Failed to delete category');
        }
    };

    if (loading && !stats) return <div className="text-center p-5 text-light">Loading admin dashboard...</div>;

    if (error) {
        return (
            <div className="card text-center p-5 bg-dark" style={{ borderLeft: '4px solid var(--danger)' }}>
                <FaShieldAlt size={40} color="var(--danger)" style={{ marginBottom: '15px' }} />
                <h3>Access Denied</h3>
                <p className="text-light mt-2">{error}</p>
                <Link to="/dashboard" className="btn mt-4" style={{ backgroundColor: 'var(--accent)' }}>
                    Go to Dashboard
                </Link>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: <FaUsers size={24} />, color: '#2196f3', desc: 'Click to manage regular users', tab: 'users' },
        { label: 'Food Items', value: stats?.totalFoodItems || 0, icon: <FaAppleAlt size={24} />, color: '#4caf50', desc: 'Click to edit food database', tab: 'foods' },
        { label: 'Total Meals', value: stats?.totalMeals || 0, icon: <FaUtensils size={24} />, color: '#ff9800', desc: 'Total meals logged by all users' },
        { label: 'Water Logs', value: stats?.totalWaterLogs || 0, icon: <FaTint size={24} />, color: '#00bcd4', desc: 'Total water entries logged by all users' },
        { label: 'Weight Logs', value: stats?.totalWeightLogs || 0, icon: <FaWeight size={24} />, color: '#e91e63', desc: 'Total weight entries logged by all users' }
    ];

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="mb-4">
                <h1>
                    <FaShieldAlt style={{ color: '#9c27b0', marginRight: '10px' }} />
                    Admin Control Center
                </h1>
                <p className="text-light mt-1">
                    Platform management interface for users, food item database, and categories.
                </p>
            </div>

            {/* Global Admin Feedback Alert */}
            {feedback.message && (
                <div 
                    className="card p-3 mb-4 text-light"
                    style={{
                        backgroundColor: feedback.type === 'error' ? 'rgba(244, 67, 54, 0.15)' : 'rgba(76, 175, 80, 0.15)',
                        borderLeft: `4px solid ${feedback.type === 'error' ? 'var(--danger)' : '#4caf50'}`
                    }}
                >
                    {feedback.message}
                </div>
            )}

            {/* Navigation Sub-Tabs */}
            <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '10px',
                flexWrap: 'wrap'
            }}>
                <button
                    className={`btn ${activeTab === 'overview' ? '' : 'btn-secondary'}`}
                    style={{ backgroundColor: activeTab === 'overview' ? '#9c27b0' : undefined }}
                    onClick={() => handleTabChange('overview')}
                >
                    📊 Overview
                </button>
                <button
                    className={`btn ${activeTab === 'users' ? '' : 'btn-secondary'}`}
                    style={{ backgroundColor: activeTab === 'users' ? '#2196f3' : undefined }}
                    onClick={() => handleTabChange('users')}
                >
                    👥 Users Management
                </button>
                <button
                    className={`btn ${activeTab === 'foods' ? '' : 'btn-secondary'}`}
                    style={{ backgroundColor: activeTab === 'foods' ? '#4caf50' : undefined }}
                    onClick={() => handleTabChange('foods')}
                >
                    🍎 Food Database Catalog
                </button>
                <button
                    className={`btn ${activeTab === 'categories' ? '' : 'btn-secondary'}`}
                    style={{ backgroundColor: activeTab === 'categories' ? '#ff9800' : undefined }}
                    onClick={() => handleTabChange('categories')}
                >
                    🏷️ Categories
                </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
                <>
                    {/* System Statistics */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '20px',
                        marginBottom: '30px'
                    }}>
                        {statCards.map((card) => (
                            <div
                                key={card.label}
                                className="card bg-dark"
                                style={{ borderTop: `4px solid ${card.color}`, cursor: 'pointer', transition: 'transform 0.15s ease' }}
                                onClick={() => {
                                    if (card.tab) handleTabChange(card.tab);
                                    else if (card.route) navigate(card.route);
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                    <div style={{
                                        color: card.color,
                                        backgroundColor: `${card.color}22`,
                                        borderRadius: '50%',
                                        width: '48px', height: '48px',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', flexShrink: 0
                                    }}>
                                        {card.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{card.label}</div>
                                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', lineHeight: 1.1 }}>{card.value}</div>
                                    </div>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', margin: 0 }}>
                                    {card.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Quick Management Actions */}
                    <div className="card bg-dark p-4" style={{ borderLeft: '4px solid #9c27b0' }}>
                        <h3 style={{ marginBottom: '18px', fontSize: '1.1rem', color: '#ce93d8' }}>
                            ⚡ Quick Management
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
                            <button
                                className="btn"
                                style={{ backgroundColor: '#1565c0', textAlign: 'left', padding: '14px 18px', borderRadius: '8px' }}
                                onClick={() => handleTabChange('users')}
                            >
                                <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>👥</div>
                                <div style={{ fontWeight: 'bold' }}>Manage Users</div>
                                <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>View, promote, delete users</div>
                            </button>
                            <button
                                className="btn"
                                style={{ backgroundColor: '#2e7d32', textAlign: 'left', padding: '14px 18px', borderRadius: '8px' }}
                                onClick={() => handleTabChange('foods')}
                            >
                                <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>🥗</div>
                                <div style={{ fontWeight: 'bold' }}>Manage Food Database</div>
                                <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>Add, edit, delete food items</div>
                            </button>
                            <button
                                className="btn"
                                style={{ backgroundColor: '#e65100', textAlign: 'left', padding: '14px 18px', borderRadius: '8px' }}
                                onClick={() => handleTabChange('categories')}
                            >
                                <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>🏷️</div>
                                <div style={{ fontWeight: 'bold' }}>Manage Categories</div>
                                <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>Organise food categories</div>
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* TAB 2: USER MANAGEMENT */}
            {activeTab === 'users' && (
                <div className="card bg-dark p-4">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by name or email..."
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                                    style={{ paddingRight: '35px' }}
                                />
                                <FaSearch
                                    style={{ position: 'absolute', right: '12px', top: '14px', color: 'var(--text-light)', cursor: 'pointer' }}
                                    onClick={fetchUsers}
                                />
                            </div>
                            <select
                                className="form-control"
                                style={{ width: '150px' }}
                                value={userRoleFilter}
                                onChange={(e) => { setUserRoleFilter(e.target.value); }}
                            >
                                <option value="all">All Roles</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            <button className="btn" style={{ backgroundColor: '#2196f3' }} onClick={fetchUsers}>
                                Filter
                            </button>
                        </div>
                        <button
                            className="btn"
                            style={{ backgroundColor: '#4caf50', display: 'flex', alignItems: 'center', gap: '6px' }}
                            onClick={() => handleOpenUserModal()}
                        >
                            <FaPlus /> Add User
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-light)' }}>
                                    <th style={{ padding: '12px' }}>Name</th>
                                    <th style={{ padding: '12px' }}>Email</th>
                                    <th style={{ padding: '12px' }}>Role</th>
                                    <th style={{ padding: '12px' }}>Joined</th>
                                    <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center p-4 text-light">No users found.</td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{user.name}</td>
                                            <td style={{ padding: '12px', color: 'var(--text-light)' }}>{user.email}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    padding: '3px 8px', borderRadius: '12px',
                                                    fontSize: '0.75rem', fontWeight: 'bold',
                                                    backgroundColor: user.role === 'admin' ? 'rgba(156, 39, 176, 0.2)' : 'rgba(33, 150, 243, 0.2)',
                                                    color: user.role === 'admin' ? '#9c27b0' : '#2196f3',
                                                    border: `1px solid ${user.role === 'admin' ? '#9c27b0' : '#2196f3'}`
                                                }}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>
                                                {user.role !== 'admin' && (
                                                    <>
                                                        <button
                                                            className="btn btn-secondary"
                                                            style={{ padding: '4px 10px', fontSize: '0.8rem', marginRight: '6px' }}
                                                            onClick={() => handleOpenUserModal(user)}
                                                            title="Edit User"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            className="btn"
                                                            style={{ padding: '4px 10px', fontSize: '0.8rem', backgroundColor: 'var(--danger)' }}
                                                            onClick={() => handleDeleteUser(user._id, user.name)}
                                                            title="Delete User"
                                                        >
                                                            <FaTrashAlt />
                                                        </button>
                                                    </>
                                                )}
                                                {user.role === 'admin' && (
                                                    <span style={{ fontSize: '0.8rem', color: '#9c27b0', fontStyle: 'italic' }}>Protected</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 3: FOOD DATABASE CATALOG */}
            {activeTab === 'foods' && (
                <div className="card bg-dark p-4">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '15px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: '15px', flex: 1, minWidth: '280px' }}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search food items..."
                                value={foodSearch}
                                onChange={(e) => setFoodSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchFoodItems()}
                            />
                            <button className="btn" style={{ backgroundColor: '#4caf50' }} onClick={fetchFoodItems}>
                                Search
                            </button>
                        </div>
                        <button className="btn" style={{ backgroundColor: '#4caf50' }} onClick={() => handleOpenFoodModal()}>
                            <FaPlus className="me-1" /> Add Food Item
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-light)' }}>
                                    <th style={{ padding: '12px' }}>Name</th>
                                    <th style={{ padding: '12px' }}>Category</th>
                                    <th style={{ padding: '12px' }}>Serving</th>
                                    <th style={{ padding: '12px' }}>Calories</th>
                                    <th style={{ padding: '12px' }}>P / C / F</th>
                                    <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {foodItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center p-4 text-light">No food items found in catalog.</td>
                                    </tr>
                                ) : (
                                    foodItems.map((food) => (
                                        <tr key={food._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{food.name}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    padding: '2px 8px',
                                                    borderRadius: '10px',
                                                    fontSize: '0.75rem',
                                                    backgroundColor: 'rgba(76, 175, 80, 0.15)',
                                                    color: '#4caf50',
                                                    border: '1px solid #4caf50'
                                                }}>
                                                    {food.category}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                                                {food.servingSize} {food.servingUnit}
                                            </td>
                                            <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--accent)' }}>
                                                {food.calories} kcal
                                            </td>
                                            <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                                                <span style={{ color: '#4caf50' }}>{food.protein}g P</span> / {' '}
                                                <span style={{ color: '#2196f3' }}>{food.carbohydrates}g C</span> / {' '}
                                                <span style={{ color: '#ff9800' }}>{food.fats}g F</span>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>
                                                <button
                                                    className="btn btn-secondary me-2"
                                                    style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                                    onClick={() => handleOpenFoodModal(food)}
                                                >
                                                    <FaEdit /> Edit
                                                </button>
                                                <button
                                                    className="btn"
                                                    style={{ padding: '4px 8px', fontSize: '0.8rem', backgroundColor: 'var(--danger)' }}
                                                    onClick={() => handleDeleteFoodItem(food._id, food.name)}
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 4: CATEGORIES MANAGEMENT */}
            {activeTab === 'categories' && (
                <div className="card bg-dark p-4">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>Food Categories</h3>
                        <button className="btn" style={{ backgroundColor: '#ff9800' }} onClick={() => handleOpenCategoryModal()}>
                            <FaFolderPlus className="me-1" /> Add New Category
                        </button>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '15px'
                    }}>
                        {categories.map((cat) => (
                            <div key={cat._id} className="card" style={{ borderLeft: '4px solid #ff9800', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{cat.name}</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '4px', marginBottom: '10px' }}>
                                            {cat.description || 'No description provided.'}
                                        </p>
                                    </div>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        backgroundColor: 'rgba(255, 152, 0, 0.2)',
                                        color: '#ff9800',
                                        padding: '2px 8px',
                                        borderRadius: '10px',
                                        fontWeight: 'bold'
                                    }}>
                                        {cat.foodCount || 0} Foods
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                                    <button 
                                        className="btn btn-secondary" 
                                        style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                                        onClick={() => handleOpenCategoryModal(cat)}
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button 
                                        className="btn" 
                                        style={{ padding: '4px 8px', fontSize: '0.8rem', backgroundColor: 'var(--danger)' }}
                                        onClick={() => handleDeleteCategory(cat._id, cat.name)}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* USER MODAL (ADD / EDIT) */}
            {showUserModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '20px'
                }}>
                    <div className="card bg-dark p-4" style={{ maxWidth: '440px', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                            <h3 style={{ margin: 0 }}>
                                {editingUser ? '✏️ Edit User' : '➕ Add New User'}
                            </h3>
                            <FaTimes style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => setShowUserModal(false)} />
                        </div>
                        <form onSubmit={handleSaveUser}>
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter full name"
                                    value={userFormData.name}
                                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email Address *</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter email address"
                                    value={userFormData.email}
                                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                                    required
                                />
                            </div>
                            {!editingUser && (
                                <div className="form-group">
                                    <label>Password * (min. 6 characters)</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Set a password"
                                        value={userFormData.password}
                                        onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit" className="btn" style={{ flex: 1, backgroundColor: '#4caf50' }}>
                                    {editingUser ? 'Save Changes' : 'Create User'}
                                </button>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowUserModal(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* FOOD MODAL (ADD / EDIT) */}
            {showFoodModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '20px'
                }}>
                    <div className="card bg-dark p-4" style={{ maxWidth: '550px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>{editingFood ? 'Edit Food Item' : 'Add New Food Item'}</h3>
                            <FaTimes style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => setShowFoodModal(false)} />
                        </div>
                        <form onSubmit={handleSaveFoodItem}>
                            <div className="mb-3">
                                <label className="form-label">Food Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={foodFormData.name}
                                    onChange={(e) => setFoodFormData({ ...foodFormData, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Category *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    list="categories-list"
                                    value={foodFormData.category}
                                    onChange={(e) => setFoodFormData({ ...foodFormData, category: e.target.value })}
                                    placeholder="Select or enter category..."
                                />
                                <datalist id="categories-list">
                                    {categories.map(c => <option key={c._id} value={c.name} />)}
                                </datalist>
                            </div>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="form-label">Calories (kcal) *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        className="form-control"
                                        required
                                        value={foodFormData.calories}
                                        onChange={(e) => setFoodFormData({ ...foodFormData, calories: e.target.value })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label">Protein (g) *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        className="form-control"
                                        required
                                        value={foodFormData.protein}
                                        onChange={(e) => setFoodFormData({ ...foodFormData, protein: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="form-label">Carbs (g) *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        className="form-control"
                                        required
                                        value={foodFormData.carbohydrates}
                                        onChange={(e) => setFoodFormData({ ...foodFormData, carbohydrates: e.target.value })}
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label">Fats (g) *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        className="form-control"
                                        required
                                        value={foodFormData.fats}
                                        onChange={(e) => setFoodFormData({ ...foodFormData, fats: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4 mb-3">
                                    <label className="form-label">Fiber (g) *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        className="form-control"
                                        required
                                        value={foodFormData.fiber}
                                        onChange={(e) => setFoodFormData({ ...foodFormData, fiber: e.target.value })}
                                    />
                                </div>
                                <div className="col-4 mb-3">
                                    <label className="form-label">Serving Size *</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="form-control"
                                        required
                                        value={foodFormData.servingSize}
                                        onChange={(e) => setFoodFormData({ ...foodFormData, servingSize: e.target.value })}
                                    />
                                </div>
                                <div className="col-4 mb-3">
                                    <label className="form-label">Unit *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={foodFormData.servingUnit}
                                        onChange={(e) => setFoodFormData({ ...foodFormData, servingUnit: e.target.value })}
                                        placeholder="g, ml, cup..."
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowFoodModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn" style={{ backgroundColor: '#4caf50' }}>
                                    {editingFood ? 'Save Changes' : 'Create Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CATEGORY MODAL (ADD / EDIT) */}
            {showCategoryModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '20px'
                }}>
                    <div className="card bg-dark p-4" style={{ maxWidth: '450px', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0 }}>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
                            <FaTimes style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => setShowCategoryModal(false)} />
                        </div>
                        <form onSubmit={handleSaveCategory}>
                            <div className="mb-3">
                                <label className="form-label">Category Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={categoryFormData.name}
                                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={categoryFormData.description}
                                    onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                                    placeholder="Brief summary of foods in this category..."
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCategoryModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn" style={{ backgroundColor: '#ff9800' }}>
                                    {editingCategory ? 'Update Category' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
