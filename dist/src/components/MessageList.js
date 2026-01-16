"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const MessageList = ({ messages }) => {
    if (messages.length === 0) {
        return (react_1.default.createElement("div", { className: "flex items-center justify-center h-full text-gray-500" }, "No new messages"));
    }
    return (react_1.default.createElement("div", { className: "flex flex-col gap-2 p-2" }, messages.map((msg) => (react_1.default.createElement("div", { key: msg.id, className: `flex gap-3 p-3 rounded-lg ${msg.isMention ? 'bg-yellow-900/20 border border-yellow-700/50' : 'bg-slate-800/50'}` },
        react_1.default.createElement("div", { className: "flex-shrink-0" }, msg.avatar ? (react_1.default.createElement("img", { src: msg.avatar, alt: msg.sender, className: "w-8 h-8 rounded-full" })) : (react_1.default.createElement("div", { className: "w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs" }, msg.sender[0]))),
        react_1.default.createElement("div", { className: "flex-1 min-w-0" },
            react_1.default.createElement("div", { className: "flex justify-between items-baseline" },
                react_1.default.createElement("span", { className: "font-semibold text-sm text-slate-200" }, msg.sender),
                react_1.default.createElement("span", { className: "text-xs text-gray-500" }, new Date(parseFloat(msg.timestamp) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))),
            react_1.default.createElement("p", { className: "text-sm text-gray-300 break-words" }, msg.text)))))));
};
exports.default = MessageList;
