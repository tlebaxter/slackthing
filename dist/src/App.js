"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const deskthing_client_1 = require("deskthing-client");
const MessageList_1 = __importDefault(require("./components/MessageList"));
const NotificationToast_1 = __importDefault(require("./components/NotificationToast"));
const App = () => {
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [notification, setNotification] = (0, react_1.useState)(null);
    const [botToken, setBotToken] = (0, react_1.useState)('');
    const [appToken, setAppToken] = (0, react_1.useState)('');
    const [showSettings, setShowSettings] = (0, react_1.useState)(false);
    const [status, setStatus] = (0, react_1.useState)('Disconnected');
    const deskthing = deskthing_client_1.DeskThing;
    (0, react_1.useEffect)(() => {
        const onData = (data) => {
            if (data.type === 'message') {
                const newMsg = data.payload;
                setMessages(prev => [newMsg, ...prev].slice(0, 50)); // Keep last 50
                setNotification(newMsg);
                // Auto-hide notification
                setTimeout(() => {
                    setNotification(current => current?.id === newMsg.id ? null : current);
                }, 5000);
            }
            else if (data.type === 'status') {
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
    return (react_1.default.createElement("div", { className: "flex flex-col h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans" },
        notification && (react_1.default.createElement(NotificationToast_1.default, { message: notification, onClose: () => setNotification(null) })),
        react_1.default.createElement("header", { className: "flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 shadow-sm" },
            react_1.default.createElement("div", { className: "flex items-center gap-2" },
                react_1.default.createElement("h1", { className: "text-lg font-bold text-white tracking-tight" }, "SlackThing"),
                react_1.default.createElement("span", { className: `text-xs px-2 py-0.5 rounded-full ${status.includes('Connected') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}` }, status)),
            react_1.default.createElement("button", { onClick: () => setShowSettings(!showSettings), className: "text-sm text-slate-400 hover:text-white transition-colors" }, showSettings ? 'Close' : 'Settings')),
        react_1.default.createElement("main", { className: "flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700" }, showSettings ? (react_1.default.createElement("div", { className: "p-6 space-y-4 max-w-md mx-auto mt-10 bg-slate-900 rounded-xl border border-slate-800" },
            react_1.default.createElement("h2", { className: "text-xl font-semibold text-white" }, "Setup"),
            react_1.default.createElement("p", { className: "text-sm text-slate-400" }, "Enter your Slack App tokens to connect."),
            react_1.default.createElement("div", { className: "space-y-2" },
                react_1.default.createElement("label", { className: "block text-xs uppercase text-slate-500 font-bold" }, "Bot Token (xoxb-)"),
                react_1.default.createElement("input", { type: "password", value: botToken, onChange: e => setBotToken(e.target.value), className: "w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none", placeholder: "xoxb-..." })),
            react_1.default.createElement("div", { className: "space-y-2" },
                react_1.default.createElement("label", { className: "block text-xs uppercase text-slate-500 font-bold" }, "App Token (xapp-)"),
                react_1.default.createElement("input", { type: "password", value: appToken, onChange: e => setAppToken(e.target.value), className: "w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none", placeholder: "xapp-..." })),
            react_1.default.createElement("button", { onClick: handleSaveSettings, className: "w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded transition-colors" }, "Connect"))) : (react_1.default.createElement(MessageList_1.default, { messages: messages })))));
};
exports.default = App;
