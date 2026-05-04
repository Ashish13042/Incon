import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Feed.css';

interface Post {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    author: {
        _id: string;
        username: string;
        role: string;
    };
}

const CATEGORIES = [
    { id: 'all', label: 'All Pitches' },
    { id: 'startup', label: 'Startup Pitches' },
    { id: 'investment', label: 'Investment Asks' },
    { id: 'market', label: 'Market Updates' },
    { id: 'networking', label: 'Networking' },
    { id: 'events', label: 'Events' },
];

// Helper: get initials from name
const initials = (name: string) =>
    name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '??';

// Helper: relative time
const relativeTime = (date: string) => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Feed: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [isComposing, setIsComposing] = useState(false);
    const [newPitch, setNewPitch] = useState({ title: '', content: '' });
    const [posting, setPosting] = useState(false);

    const fetchPosts = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }
            const response = await axios.get('http://localhost:5000/api/posts', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPosts(response.data);
            setLoading(false);
        } catch {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPitch.title.trim() || !newPitch.content.trim()) return;
        setPosting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/posts', newPitch, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNewPitch({ title: '', content: '' });
            setIsComposing(false);
            await fetchPosts();
        } catch {
            alert('Failed to post. Please try again.');
        } finally {
            setPosting(false);
        }
    };

    // Pinned = latest 3 posts (simulated)
    const pinnedPosts = posts.slice(0, 3);

    return (
        <div className="feed-shell">

            {/* ── Top Header ── */}
            <header className="feed-header">
                <span className="feed-header-logo">✦ Incon</span>
                <Link to="/dashboard" className="feed-header-tab">Network</Link>
                <Link to="/feed" className="feed-header-tab active">Live Feed</Link>
                <div className="feed-header-spacer" />
                <div className="feed-header-actions">
                    <button className="feed-header-new-btn" onClick={() => setIsComposing(true)} title="New Pitch">+</button>
                    <button className="feed-header-btn" title="Search">🔍</button>
                    <button className="feed-header-btn" title="Notifications">🔔</button>
                    <div className="feed-avatar-sm">{initials(currentUser.username || '')}</div>
                </div>
            </header>

            {/* ── Three-Panel Body ── */}
            <div className="feed-body">

                {/* ── Left Sidebar ── */}
                <aside className="feed-sidebar-left">
                    <div className="feed-sidebar-card">
                        <div className="feed-sidebar-header">
                            <span className="feed-sidebar-title">Category</span>
                            <button className="feed-add-btn">＋ Add New</button>
                        </div>

                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                className={`feed-category-item ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.label}
                                {cat.id === 'all' && (
                                    <span className="feed-category-badge">{posts.length}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* ── Center Feed ── */}
                <main className="feed-center">

                    {/* Create Post Box */}
                    <div className="feed-create-box">
                        <div className="feed-create-top">
                            <div className="feed-post-avatar">{initials(currentUser.username || '')}</div>
                            <input
                                className="feed-create-input"
                                placeholder="Share a pitch or update..."
                                readOnly={!isComposing}
                                onClick={() => setIsComposing(true)}
                            />
                        </div>

                        {!isComposing ? (
                            <div className="feed-create-actions">
                                <button className="feed-action-chip" onClick={() => setIsComposing(true)}>📊 Pitch</button>
                                <button className="feed-action-chip" onClick={() => setIsComposing(true)}>💼 Opportunity</button>
                                <button className="feed-action-chip" onClick={() => setIsComposing(true)}>📅 Event</button>
                                <button className="feed-action-chip feed-action-chip-primary" onClick={() => setIsComposing(true)}>✨ Post</button>
                            </div>
                        ) : (
                            <form className="feed-create-expanded" onSubmit={handlePostSubmit}>
                                <input
                                    className="feed-create-field"
                                    placeholder="Pitch Title (e.g., Seeking Seed Funding for HealthTech SaaS)"
                                    value={newPitch.title}
                                    onChange={e => setNewPitch({ ...newPitch, title: e.target.value })}
                                    required
                                    autoFocus
                                />
                                <textarea
                                    className="feed-create-field"
                                    placeholder="Describe your idea, what you're looking for, traction so far..."
                                    value={newPitch.content}
                                    onChange={e => setNewPitch({ ...newPitch, content: e.target.value })}
                                    required
                                    rows={4}
                                />
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        className="feed-post-btn"
                                        style={{ background: '#f0f0f0', color: '#555' }}
                                        onClick={() => { setIsComposing(false); setNewPitch({ title: '', content: '' }); }}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="feed-post-btn" disabled={posting}>
                                        {posting ? 'Posting…' : 'Post Pitch'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Post List */}
                    {loading ? (
                        <div className="feed-loading">Loading pitches…</div>
                    ) : posts.length === 0 ? (
                        <div className="feed-empty">
                            <h3>No pitches yet</h3>
                            <p>Be the first to share a pitch or opportunity!</p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <article key={post._id} className="feed-post-card">

                                {/* Post Header */}
                                <div className="feed-post-header">
                                    <div className={`feed-post-avatar ${post.author.role === 'investor' ? 'investor' : ''}`}>
                                        {initials(post.author.username)}
                                    </div>
                                    <div className="feed-post-meta">
                                        <div className="feed-post-author">{post.author.username}</div>
                                        <div className="feed-post-role" style={{ textTransform: 'capitalize' }}>
                                            {post.author.role} · <span className="feed-post-date">{relativeTime(post.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="feed-post-icons">
                                        <button className="feed-icon-btn" title="Pin">📌</button>
                                        <button className="feed-icon-btn" title="More">···</button>
                                    </div>
                                </div>

                                {/* Tag */}
                                <div className={`feed-post-tag ${post.author.role === 'investor' ? 'investor-tag' : 'entrepreneur-tag'}`}>
                                    {post.author.role === 'investor' ? '💼' : '🚀'}&nbsp;
                                    {post.author.role === 'investor' ? 'Investment Ask' : 'Startup Pitch'}
                                </div>

                                {/* Content */}
                                <h3 className="feed-post-title">{post.title}</h3>
                                <p className="feed-post-content">{post.content}</p>

                                {/* Stats */}
                                <div className="feed-post-stats">
                                    <span><span className="feed-stat-emoji">👍</span> {Math.floor(Math.random() * 20) + 1} people</span>
                                    <span style={{ marginLeft: 'auto' }}>
                                        {Math.floor(Math.random() * 5)} Comments · {Math.floor(Math.random() * 3)} Shares
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="feed-post-actions">
                                    <button className="feed-post-action-btn">👍 React</button>
                                    <button className="feed-post-action-btn">💬 Comment</button>
                                    <button className="feed-post-action-btn">↗ Share</button>
                                    <Link
                                        to={`/profile/${post.author._id}`}
                                        className="feed-post-action-btn feed-post-view-btn"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        View Profile →
                                    </Link>
                                </div>
                            </article>
                        ))
                    )}
                </main>

                {/* ── Right Sidebar ── */}
                <aside className="feed-sidebar-right">
                    <div className="feed-pinned-card">
                        <div className="feed-pinned-header">
                            <span className="feed-pinned-title">Pinned Pitches</span>
                            <button className="feed-icon-btn">···</button>
                        </div>

                        {pinnedPosts.length === 0 ? (
                            <p style={{ fontSize: '12.5px', color: '#bbb', textAlign: 'center', padding: '20px 0' }}>
                                No pitches yet
                            </p>
                        ) : (
                            pinnedPosts.map(post => (
                                <div key={post._id} className="feed-pinned-item">
                                    <div className="feed-pinned-item-header">
                                        <div className={`feed-pinned-avatar ${post.author.role === 'investor' ? 'investor' : ''}`}>
                                            {initials(post.author.username)}
                                        </div>
                                        <span className="feed-pinned-name">{post.author.username}</span>
                                        <span className="feed-pinned-badge">📌 Pinned</span>
                                    </div>
                                    <div className={`feed-pinned-tag`}>
                                        {post.author.role === 'investor' ? '💼 Investment Ask' : '🚀 Pitch'}
                                    </div>
                                    <p className="feed-pinned-excerpt">{post.title}</p>
                                    <p className="feed-pinned-excerpt" style={{ color: '#999' }}>
                                        {post.content.slice(0, 80)}…
                                    </p>
                                    <Link to={`/profile/${post.author._id}`} className="feed-pinned-link">
                                        View post →
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </aside>

            </div>
        </div>
    );
};

export default Feed;