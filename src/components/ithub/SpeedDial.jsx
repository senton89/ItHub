'use client';

import { useState } from "react";
import { Plus, Link2, BookOpen, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SpeedDial({ onAddResource, onAddTerm, onAddCategory }) {
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    { icon: Link2, label: "Добавить ресурс", onClick: onAddResource },
    { icon: BookOpen, label: "Добавить термин", onClick: onAddTerm },
    { icon: Tag, label: "Добавить категорию", onClick: onAddCategory },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-center gap-3">
      <AnimatePresence>
        {isOpen &&
          items.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className="w-11 h-11 rounded-full bg-white border border-black/10 shadow-lg flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors group relative"
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
              <span className="absolute right-14 px-2 py-1 bg-stone-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </span>
            </motion.button>
          ))}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        animate={{ rotate: isOpen ? 45 : 0 }}
        className="w-14 h-14 rounded-full bg-rose-600 text-white shadow-lg hover:bg-rose-700 transition-colors flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
