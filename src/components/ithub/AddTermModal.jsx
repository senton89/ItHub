'use client';

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export function AddTermModal({ isOpen, onClose, onSuccess }) {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [examples, setExamples] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!term || !definition) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          term,
          definition,
          examples: examples ? examples.split("\n").filter((e) => e.trim()) : null,
        }),
      });

      if (response.ok) {
        setTerm("");
        setDefinition("");
        setExamples("");
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error creating term:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-xl shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-black/5">
              <h2 className="text-lg font-medium">Добавить термин</h2>
              <button onClick={onClose} className="p-1 hover:bg-stone-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Термин
                </label>
                <Input
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="API, CI/CD, REST..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Определение
                </label>
                <Textarea
                  value={definition}
                  onChange={(e) => setDefinition(e.target.value)}
                  placeholder="Чёткое определение термина..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Примеры
                </label>
                <Textarea
                  value={examples}
                  onChange={(e) => setExamples(e.target.value)}
                  placeholder="Пример 1&#10;Пример 2&#10;Пример 3"
                  rows={3}
                />
                <p className="text-xs text-stone-400 mt-1">Каждый пример с новой строки</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Отмена
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1 bg-rose-600 hover:bg-rose-700">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    "Добавить"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
