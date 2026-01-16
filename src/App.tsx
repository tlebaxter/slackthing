import React, { useEffect, useState } from 'react';
import { DeskThing } from 'deskthing-client';
import MessageList from './components/MessageList';
import NotificationToast from './components/NotificationToast';

interface Message {
    id: string;
    text: string;
    sender: string;
    avatar: string;
    channel: string;
    timestamp: string;
    isMention?: boolean;
}

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [notification, setNotification] = useState<Message | null>(null);
    const [botToken, setBotToken] = useState('');
    const [appToken, setAppToken] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [status, setStatus] = useState('Disconnected');

    const deskthing = DeskThing;

    useEffect(() => {
        const onData = (data: any) => {
            if (data.type === 'message') {
                const newMsg = data.payload as Message;
                setMessages(prev => [newMsg, ...prev].slice(0, 50)); // Keep last 50
                setNotification(newMsg);
                
                // Auto-hide notification
                setTimeout(() => {
                    setNotification(current => current?.id === newMsg.id ? null : current);
                }, 5000);
            } else if (data.type === 'status') {
                setStatus(data.payload);
            }
        };

        deskthing.on('data', onData);
        
        // Request current settings if available
        // deskthing.sendDataToServer({ type: 'getSettings' });

        return () => {
            // Cleanup listener if possible, though DeskThing client might not support off
        };
    }, []);

    const handleSaveSettings = () => {
        if (botToken && appToken) {
            deskthing.send({ 
                type: 'settings', 
                payload: { botToken, appToken } 
            });
            setShowSettings(false);
        }
    };

    return (
        <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
            {/* Notification Overlay */}
            {notification && (
                <NotificationToast 
                    message={notification} 
                    onClose={() => setNotification(null)} 
                />
            )}

            {/* Header */}
            <header className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 shadow-sm">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-white tracking-tight">SlackThing</h1>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${status.includes('Connected') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {status}
                    </span>
                </div>
                <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                    {showSettings ? 'Close' : 'Settings'}
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                {showSettings ? (
                    <div className="p-6 space-y-4 max-w-md mx-auto mt-10 bg-slate-900 rounded-xl border border-slate-800">
                        <h2 className="text-xl font-semibold text-white">Setup</h2>
                        <p className="text-sm text-slate-400">Enter your Slack App tokens to connect.</p>
                        
                        <div className="space-y-2">
                            <label className="block text-xs uppercase text-slate-500 font-bold">Bot Token (xoxb-)</label>
                            <input 
                                type="password"
                                value={botToken} 
                                onChange={e => setBotToken(e.target.value)} 
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                                placeholder="xoxb-..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs uppercase text-slate-500 font-bold">App Token (xapp-)</label>
                            <input 
                                type="password"
                                value={appToken} 
                                onChange={e => setAppToken(e.target.value)} 
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                                placeholder="xapp-..."
                            />
                        </div>

                        <button 
                            onClick={handleSaveSettings}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded transition-colors"
                        >
                            Connect
                        </button>
                    </div>
                ) : (
                    <MessageList messages={messages} />
                )}
            </main>
        </div>
    );
};

export default App;
