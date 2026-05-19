'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '../../../components/qa/ImageUploader';

export default function AskPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);


  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) return;
    setLoading(true);
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        body,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        difficulty: 'BEGINNER'
      })
    });
    if (res.ok) {
      const data = await res.json();
      router.push('/questions/' + data.slug);
    } else {
      alert('Ошибка');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <a href="/questions" className="text-sm text-rose-600 hover:underline mb-6 inline-block">← Назад</a>
        <h1 className="text-2xl font-bold text-stone-800">Задать вопрос</h1>
        
        <div className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Заголовок *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Как подключить Prisma?" required className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Описание *</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Опиши проблему..." rows={8} required className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-y" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Теги</label>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="React, Next.js" className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <ImageUploader
              onImageUpload={(url) => {
                setUploadedImages(prev => [...prev, url]);
                setBody(prev => prev + `\n\n![image](${url})`);
              }}
          />

          <button onClick={handleSubmit} disabled={!title.trim() || !body.trim() || loading} className="px-6 py-2.5 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 disabled:opacity-50">
            {loading ? 'Публикация...' : 'Опубликовать'}
          </button>
        </div>
      </div>
    </div>
  );
}
