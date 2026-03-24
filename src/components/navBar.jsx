import React from "react";
import { FaSearch, FaSun, FaMoon, FaBell } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext"; 

function Navbar() {
  const { isDark, toggleTheme } = useTheme(); 

  return (
    <nav className=" shadow-sm transition-colors duration-300 bg-white dark:bg-gray-900 h-20 px-6 ">
      <div className="flex  justify-between h-full items-center ">
        <h1 className=" font-extrabold text-gray-900 dark:text-white text-3xl ">
          <span className="text-[#FFE135]">StockSight</span>
        </h1>

        <div className="flex space-x-6 mr-8 items-center ">
          <div className=" h-10 w-80 bg-gray-100 dark:bg-gray-700 rounded-lg items-center px-3 relative flex ">
            <FaSearch className="absolute text-gray-400 text-sm left-3 " />
            <input
              type="text"
              className="pl-8 text-gray-600 dark:text-gray-200 bg-transparent outline-none placeholder-gray-400 w-full "
              placeholder="Search for stock and more"
            />
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isDark
              ? <FaMoon className=" text-blue-400 text-xl " />
              : <FaSun className="text-yellow-500 text-xl " />
            }
          </button>

          <div className="relative cursor-pointer">
            <FaBell className="text-xl text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors" />
          </div>

          <div className="border-2 border-gray-200 w-10 h-10 rounded-full cursor-pointer overflow-hidden  hover:border-blue-500 transition-colors ">
            <img src="/images/profile.jpg" alt="profile" className="object-cover w-full h-full " />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;