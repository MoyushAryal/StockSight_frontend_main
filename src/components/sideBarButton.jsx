import React from "react";

function SideButton({ text, active = false }) {
    return (
        <div className={`px-4 py-3 rounded-lg transition-colors duration-300 ${
            active
                ? "bg-blue-600 text-white font-medium"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}>
            {text}
        </div>
    );
}

export default SideButton;