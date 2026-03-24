import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { newsData } from '../../../data/appData';
import { useTheme } from '../../../context/ThemeContext';

const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, triggerOnce: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="mb-4 cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

const newsSectionItems = newsData.map(item => ({
  title: item.title,
  source: item.publisher,
  time: item.date,
}));

const NewsSection = ({
  items = newsSectionItems,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1
}) => {
  const { isDark } = useTheme();
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  const handleItemMouseEnter = useCallback(index => setSelectedIndex(index), []);

  const handleItemClick = useCallback((item, index) => {
    setSelectedIndex(index);
    if (onItemSelect) onItemSelect(item, index);
  }, [onItemSelect]);

  const handleScroll = useCallback(e => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  }, []);

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = e => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) onItemSelect(items[selectedIndex], selectedIndex);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({ top: itemBottom - containerHeight + extraMargin, behavior: 'smooth' });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <div className={`relative w-full bg-white rounded-lg shadow-md transition-colors dark:bg-gray-800  duration-300 ${className}`}>
      <h3 className="text-lg font-semibold px-4 py-3 text-gray-800 border-b border-gray-200 dark:text-gray-100  dark:border-gray-700">
        Latest News
      </h3>

      <div
        ref={listRef}
        className={`h-[330px] overflow-y-auto p-4 ${
          displayScrollbar
            ? '[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-gray-100 dark:[&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-[4px]'
            : 'scrollbar-hide'
        }`}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: displayScrollbar ? 'thin' : 'none',
          scrollbarColor: isDark ? '#4B5563 #1F2937' : '#9CA3AF #F3F4F6',
        }}
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            delay={index * 0.05}
            index={index}
            onMouseEnter={() => handleItemMouseEnter(index)}
            onClick={() => handleItemClick(item, index)}
          >
            <div className={`p-4 rounded-lg transition-all ${
              selectedIndex === index
                ? 'bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500'
                : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
            } ${itemClassName}`}>
              <p className="font-semibold text-gray-800 dark:text-gray-100 m-0">{item.title}</p>
              <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{item.source}</span>
                <span>{item.time}</span>
              </div>
            </div>
          </AnimatedItem>
        ))}
      </div>

      {showGradients && (
        <>
          <div
            className="absolute top-[52px] left-0 right-0 h-[50px] pointer-events-none transition-opacity duration-300"
            style={{
              opacity: topGradientOpacity,
              background: isDark
                ? 'linear-gradient(to bottom, #1F2937, transparent)'
                : 'linear-gradient(to bottom, white, transparent)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px] pointer-events-none transition-opacity duration-300"
            style={{
              opacity: bottomGradientOpacity,
              background: isDark
                ? 'linear-gradient(to top, #1F2937, transparent)'
                : 'linear-gradient(to top, white, transparent)',
            }}
          />
        </>
      )}
    </div>
  );
};

export default NewsSection;