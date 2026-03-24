import { motion, useInView } from 'framer-motion';
import React, { useState, useEffect } from "react";
import { format } from 'date-fns';
import NepaliDate from 'nepali-date-converter';

function Topright() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const nepaliDate = new NepaliDate(currentTime);

    return (
        <div className="flex gap-10 flex-col">

            <div className="bg-white dark:bg-gray-800 h-[130px] w-[300px] rounded-lg shadow-md dark:shadow-gray-900 p-4 transition-colors duration-300 hover-glow">
                <div className="space-y-3">
                    <div className="flex items-start gap-2">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">English Date</p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                {format(currentTime, 'EEEE, MMMM do, yyyy')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-2">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">नेपाली मिति</p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                                {nepaliDate.format('YYYY MMMM DD, dddd')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 h-[130px] w-[300px] rounded-lg shadow-md p-4 transition-colors duration-300 flex items-center gap-3 hover-glow">
                <span className="text-purple-500 text-3xl"></span>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current Time</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        {format(currentTime, 'hh:mm:ss a')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {format(currentTime, 'zzz')}
                    </p>
                </div>
            </div>

        </div>
    );
}

export default Topright;