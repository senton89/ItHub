'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import ImageUploader from '../../../components/qa/ImageUploader';

const DIFFICULTIES = [
  { value: 'BEGINNER', label: 'Начальный', active: 'bg-green-50 border-green-300 text-green-700' },
  { value: 'INTERMEDIATE', label: 'Средний', active: 'bg-yellow-50 border-yellow-300 text-yellow-700' },
  { value: 'ADVANCED', label: 'Продвинутый', active: 'bg-red-50 border-red-300 text-red-700' },
];

export default function AskPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [difficulty, setDifficulty] = useState('BEGINNER');
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!session) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          difficulty,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push('/questions/' + data.question.slug);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Ошибка при создании вопроса');
        setLoading(false);
      }
    } catch (e) {
      alert('Ошибка сети');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <a href="/questions" className="text-sm text-blue-600 hover:underline mb-6 inline-block">← Назад</a>
        <h1 className="text-2xl font-bold text-stone-800">Задать вопрос</h1>

        <div className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Заголовок *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Как подключить Prisma?"
              required
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Описание *</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Опиши проблему..."
              rows={8}
              required
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Теги</label>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="React, Next.js (через запятую)"
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Сложность</label>
            <div className="flex gap-2">
              {DIFFICULTIES.map(d => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDifficulty(d.value)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                    difficulty === d.value
                      ? d.active
                      : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <ImageUploader
            onImageUpload={(url) => {
              setUploadedImages(prev => [...prev, url]);
              setBody(prev => prev + `\n\n![image](${url})`);
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !body.trim() || loading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Публикация...' : 'Опубликовать'}
          </button>
        </div>
      </div>
    </div>
  );
}
