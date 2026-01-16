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

interface NotificationToastProps {
    message: Message;
    onClose?: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ message, onClose }) => {
    return (
        <div className="absolute top-4 right-4 bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl max-w-sm z-50 animate-bounce-in">
            <div className="flex items-start gap-3">
                {message.avatar && (
                    <img src={message.avatar} alt={message.sender} className="w-10 h-10 rounded-full" />
                )}
                <div className="flex-1">
                    <h4 className="font-bold text-white text-sm">{message.sender}</h4>
                    <p className="text-gray-300 text-xs line-clamp-2">{message.text}</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    ×
                </button>
            </div>
        </div>
    );
};

export default NotificationToast;
