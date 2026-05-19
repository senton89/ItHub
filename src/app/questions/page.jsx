"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, MessageSquare, User } from 'lucide-react';


export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('new');

  useEffect(() => { loadQuestions('new'); }, []);

  const loadQuestions = (sort, search) => {
    setLoading(true);
    let url = '/api/questions?sort=' + (sort || 'new');
    if (search && search.trim()) url += '&q=' + encodeURIComponent(search.trim());
    fetch(url).then(r => r.json()).then(d => { setQuestions(d.questions || []); setLoading(false); }).catch(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-stone-800 hover:text-rose-600 font-bold text-lg">&larr; IThub</Link>
          <h1 className="text-xl font-bold text-stone-800">Вопросы</h1>
        </div>
      </div>

      <div className="bg-white border-b border-stone-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={(e) => { e.preventDefault(); loadQuestions(activeTab, searchQuery); }} className="flex gap-2 mb-3">
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск..." className="flex-1 px-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50">Найти</button>
          </form>
          <div className="flex gap-1 bg-stone-100 rounded-lg p-1 w-fit">
            {[{id:'new',label:'Новые'},{id:'top',label:'Лучшие'},{id:'unanswered',label:'Без ответов'}].map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); loadQuestions(tab.sort); }} className={"px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer " + (activeTab===tab.id ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900")}>{tab.label}{tab.id==='unanswered' ? "("+questions.length+")" : ""}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-3">{[1,2,3,4,5,6].map(i=><div key={i} className="h-24 bg-white rounded-xl border border-stone-200 animate-pulse"></div>)}</div>
        ) : questions.length === 0 ? (
          <div className="text-center py-16"><div className="text-6xl mb-4">🔍</div><h2 className="text-xl font-semibold text-stone-700 mt-2">{searchQuery?"Ничего не найдено":"Вопросов пока нет"}</h2><p className="text-stone-500 mt-2">{searchQuery?"Попробуйте другие ключевые слова":"Будьте первым!"}</p>{!searchQuery && <a href="/questions/ask" className="inline-block mt-4 text-rose-600 hover:underline font-medium">Создать вопрос →</a>}</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {questions.map(q => {
              const slug = q.slug || "";
              return (
                <Link key={q.id} href={"/questions/" + slug} className="group block">
                  <article className="bg-white rounded-xl border border-stone-200 p-5 hover:border-rose-300 hover:shadow-lg transition-all h-full flex flex-col">
                    <div className="flex items-center justify-between text-sm mb-3 pb-3 border-b border-stone-100">
                      <span className="font-bold text-lg text-stone-700">{q.voteCount}<span className="text-xs font-normal text-stone-400 ml-1">голосов</span></span>
                      <span className="flex items-center gap-1 text-stone-500"><MessageSquare size={14}/><span>{q._count?.answers||0}</span></span>
                      {q.isAnswered && <span className="flex items-center gap-1 text-green-600 text-xs font-medium"><CheckCircle2 size={14}/> Решено</span>}
                    </div>
                    <h2 className="font-semibold text-stone-800 group-hover:text-rose-600 line-clamp-2">{q.title}</h2>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {q.tags?.map(({tag})=>(<span key={tag.id} style={{backgroundColor:tag.color+"20",color:tag.color}} className="px-2 py-0.5 text-xs rounded-full inline-block font-medium">{tag.name}</span>))}
                      {q.difficulty && <span className={"px-2 py-0.5 text-xs rounded-full font-medium "+(q.difficulty==="BEGINNER"?"bg-green-100 text-green-700":q.difficulty==="INTERMEDIATE"?"bg-yellow-100 text-yellow-700":"bg-red-100 text-red-700")}>{q.difficulty==="BEGINNER"?"🟢 Начальный":q.difficulty==="INTERMEDIATE"?"🟡 Средний":"🔴 Продвинутый"}</span>}
                    </div>
                    <p className="text-sm text-stone-600 mt-2 line-clamp-3">{(q.body||"").substring(0,150)}...</p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-100 text-xs text-stone-400">
                      <span className="flex items-center gap-1"><User size={12}/>{q.author?.name||"Аноним"}</span>
                      <span>{new Date(q.createdAt).toLocaleDateString("ru-RU")}</span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
        <Link href="/questions/ask" className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-rose-600 text-white shadow-xl hover:bg-rose-700 active:scale-110 transition-all flex items-center justify-center text-2xl">+</Link>
      </div>
    </div>
  );
}