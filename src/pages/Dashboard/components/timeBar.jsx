import React from "react";

function Timebar() {
    return (
        <div className="flex gap-16">
            <div className="bg-white dark:bg-gray-800 h-[300px] w-[700px] rounded-lg shadow-md p-4 transition-colors duration-300 hover-glow">
                <p className="text-gray-800 dark:text-gray-200">Activity bar</p>
            </div>
            <div className="bg-white dark:bg-gray-800 h-[300px] w-[400px] rounded-lg shadow-md p-4 transition-colors duration-300 hover-glow">
                <p className="text-gray-800 dark:text-gray-200">Content</p>
            </div>
        </div>
    );
}

export default Timebar;