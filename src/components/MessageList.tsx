import React from 'react';

interface Message {
    id: string;
    text: string;
    sender: string;
    avatar: string;
    channel: string;
    timestamp: string;
    isMention?: boolean;
}

interface MessageListProps {
    messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    if (messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                No new messages
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 p-2">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 p-3 rounded-lg ${msg.isMention ? 'bg-yellow-900/20 border border-yellow-700/50' : 'bg-slate-800/50'}`}>
                    <div className="flex-shrink-0">
                         {msg.avatar ? (
                            <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full" />
                        ) : (
                            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs">
                                {msg.sender[0]}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                            <span className="font-semibold text-sm text-slate-200">{msg.sender}</span>
                            <span className="text-xs text-gray-500">
                                {new Date(parseFloat(msg.timestamp) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <p className="text-sm text-gray-300 break-words">{msg.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
