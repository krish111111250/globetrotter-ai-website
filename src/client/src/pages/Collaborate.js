import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchPosts, createPost } from '../api';

const Collaborate = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ content: '', tags: '' });
    const [showPostForm, setShowPostForm] = useState(false);

    const avatars = [
        { id: 1, char: 'C', color: 'bg-primary-500' },
        { id: 2, char: 'D', color: 'bg-indigo-500' },
        { id: 3, char: 'M', color: 'bg-accent-teal' },
        { id: 4, char: 'R', color: 'bg-aero-900' },
        { id: 5, char: 'V', color: 'bg-accent-gold' },
    ];

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const { data } = await fetchPosts();
            setPosts(data.posts);
        } catch (err) {
            console.error("Failed to fetch posts", err);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
        if (!userId) return alert("Please login to post");

        try {
            await createPost({
                userId,
                content: newPost.content,
                tags: newPost.tags
            });
            setShowPostForm(false);
            setNewPost({ content: '', tags: '' });
            loadPosts();
        } catch (err) {
            console.error("Failed to create post", err);
        }
    };

    const getInitials = (first, last) => {
        return (first?.[0] || 'G') + (last?.[0] || 'T');
    };

    const getRandomColor = (id) => {
        const colors = ['bg-primary-500', 'bg-accent-gold', 'bg-accent-teal', 'bg-indigo-600', 'bg-aero-700'];
        return colors[id % colors.length];
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">

            {/* Community Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-serif italic text-aero-900 mb-2">Community Hub</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-primary-500 font-black text-[10px] uppercase tracking-[0.4em]">Explorer Network</span>
                        <div className="h-px w-12 bg-aero-200"></div>
                        <span className="text-aero-400 font-bold text-[10px] uppercase tracking-widest">Live Transmissions</span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-aero-600 hover:text-primary-500 transition-all active:scale-95 border border-aero-200"
                    >
                        ← Back to Dashboard
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                            {avatars.map((av) => (
                                <div key={av.id} className={`${av.color} w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-white text-xs font-black shadow-glass transition-transform hover:scale-110 cursor-pointer`}>
                                    {av.char}
                                </div>
                            ))}
                            <div className="bg-aero-100 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-aero-400 text-[10px] font-black shadow-glass cursor-pointer">
                                +4k
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controller Bar */}
            <div className="glass-panel p-2 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative w-full group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
                    <input
                        type="text"
                        placeholder="Search transmissions, locations, or insights..."
                        className="w-full pl-16 pr-6 py-5 bg-white/50 border-none rounded-[2rem] font-bold text-aero-900 outline-none focus:bg-white transition-all text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setShowPostForm(!showPostForm)}
                    className="bg-aero-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95 shrink-0"
                >
                    {showPostForm ? 'ABORT TRANSMISSION' : 'INITIATE POST'}
                </button>
            </div>

            {/* Compose Area */}
            {showPostForm && (
                <div className="glass-card p-10 rounded-[3rem] border-primary-500/20 bg-white/60 animate-in zoom-in-95 duration-300">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white text-lg">💡</div>
                        <h3 className="text-xl font-display font-black text-aero-900 uppercase">Broadcast Insight</h3>
                    </div>
                    <form onSubmit={handleCreatePost} className="space-y-6">
                        <textarea
                            required
                            className="w-full p-6 bg-aero-50 rounded-[2rem] font-medium border-2 border-transparent outline-none focus:border-primary-400 focus:bg-white h-40 resize-none transition-all placeholder:italic"
                            placeholder="Share a story, a warning, or a gem you discovered..."
                            value={newPost.content}
                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        />
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <input
                                type="text"
                                className="flex-1 w-full p-4 bg-aero-50 rounded-[1.5rem] font-bold border-2 border-transparent outline-none focus:border-primary-400 focus:bg-white transition-all text-sm"
                                placeholder="Add tags (e.g. #Hokkaido #Sushi)"
                                value={newPost.tags}
                                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                            />
                            <button className="bg-primary-600 text-white px-12 py-4 rounded-[1.5rem] font-display font-black uppercase text-[10px] tracking-widest hover:bg-primary-500 transition-all shadow-xl active:scale-95">
                                TRANSMIT
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Feed Section */}
            <div className="grid gap-10">
                {posts.length === 0 ? (
                    <div className="text-center py-32 glass-card rounded-[3rem]">
                        <span className="text-6xl mb-6 block">🎑</span>
                        <h3 className="text-2xl font-serif italic text-aero-900">Quiet in the valley</h3>
                        <p className="text-aero-400 font-black text-[10px] uppercase tracking-widest mt-2">Be the first to break the silence</p>
                    </div>
                ) : (
                    posts.filter(p => p.content.toLowerCase().includes(search.toLowerCase())).map((post) => (
                        <div key={post.id} className="group flex flex-col md:flex-row gap-8 items-start">
                            {/* User Avatar */}
                            <div className="flex flex-col items-center gap-2 shrink-0 md:pt-4">
                                <div className={`${getRandomColor(post.id)} w-20 h-20 rounded-[2.5rem] flex items-center justify-center text-white text-2xl font-display font-black shadow-glass group-hover:scale-105 transition-transform duration-500`}>
                                    {getInitials(post.firstName, post.lastName)}
                                </div>
                                <div className="h-10 w-px bg-aero-100 md:block hidden"></div>
                            </div>

                            {/* Post Body */}
                            <div className="flex-1 glass-card p-8 md:p-12 rounded-[3.5rem] group-hover:border-primary-500/30 transition-all duration-700">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-aero-900 uppercase">
                                            {post.firstName} {post.lastName}
                                        </span>
                                        <span className="w-1 h-1 bg-aero-200 rounded-full"></span>
                                        <span className="text-[10px] font-medium text-aero-400 uppercase tracking-widest">Verfied Explorer</span>
                                    </div>
                                    <span className="text-aero-300 text-[10px] font-black uppercase tracking-tighter">
                                        {new Date(post.timestamp).toLocaleDateString()}
                                    </span>
                                </div>

                                <blockquote className="text-aero-800 font-serif italic text-2xl leading-relaxed mb-10">
                                    "{post.content}"
                                </blockquote>

                                <div className="flex flex-wrap gap-2">
                                    {post.tags && post.tags.split(' ').map((tag, i) => (
                                        <span key={i} className="bg-aero-50 px-4 py-1.5 rounded-full text-[9px] font-black text-primary-600 uppercase tracking-widest border border-aero-100">
                                            {tag.startsWith('#') ? tag : `#${tag}`}
                                        </span>
                                    ))}
                                    <div className="flex-1"></div>
                                    <div className="flex gap-4">
                                        <button className="text-aero-300 hover:text-primary-500 text-lg transition-colors">💬</button>
                                        <button className="text-aero-300 hover:text-accent-gold text-lg transition-colors">✨</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Collaborate;
