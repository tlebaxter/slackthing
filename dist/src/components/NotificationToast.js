"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const NotificationToast = ({ message, onClose }) => {
    return (react_1.default.createElement("div", { className: "absolute top-4 right-4 bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-xl max-w-sm z-50 animate-bounce-in" },
        react_1.default.createElement("div", { className: "flex items-start gap-3" },
            message.avatar && (react_1.default.createElement("img", { src: message.avatar, alt: message.sender, className: "w-10 h-10 rounded-full" })),
            react_1.default.createElement("div", { className: "flex-1" },
                react_1.default.createElement("h4", { className: "font-bold text-white text-sm" }, message.sender),
                react_1.default.createElement("p", { className: "text-gray-300 text-xs line-clamp-2" }, message.text)),
            react_1.default.createElement("button", { onClick: onClose, className: "text-gray-400 hover:text-white" }, "\u00D7"))));
};
exports.default = NotificationToast;
