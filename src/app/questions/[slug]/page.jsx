'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckCircle2, ThumbsUp, ThumbsDown, Eye, MessageSquare, ArrowLeft, Clock, User, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function QuestionDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answerBody, setAnswerBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [votes, setVotes] = useState({});
  const [voteLoading, setVoteLoading] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch('/api/questions/' + params.slug)
      .then(r => r.json())
      .then(data => {
        if (data.error) { router.push('/questions'); return; }
        setQuestion(data);
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, [params.slug]);

  const vk = (type, id) => `${type}-${id}`;

  const handleVote = async (dir, targetType, targetId) => {
    if (!session) { router.push('/login'); return; }
    const key = vk(targetType, targetId);
    setVoteLoading(key);
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, targetId, voteType: dir === 'up' ? 'UP' : 'DOWN' }),
      });
      if (res.ok) {
        const data = await res.json();
        setVotes(prev => ({ ...prev, [key]: data.userVoteType }));
        if (targetType === 'question') {
          setQuestion(prev => ({ ...prev, voteCount: data.voteCount }));
        } else {
          setQuestion(prev => ({
            ...prev,
            answers: prev.answers.map(a =>
              a.id === targetId ? { ...a, voteCount: data.voteCount } : a
            ),
          }));
        }
      }
    } catch (e) { console.error(e); }
    finally { setVoteLoading(null); }
  };

  const handleAnswer = async () => {
    if (!answerBody.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/questions/' + params.slug + '/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: answerBody }),
      });
      if (res.ok) {
        setAnswerBody('');
        const updated = await fetch('/api/questions/' + params.slug).then(r => r.json());
        setQuestion(updated);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Ошибка при отправке ответа');
      }
    } catch (e) { console.error(e); }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!confirm("Удалить вопрос? Это действие нельзя отменить.")) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/questions/" + params.slug, { method: "DELETE" });
      if (res.ok) {
        router.push("/questions");
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Ошибка при удалении");
      }
    } catch (e) {
      alert("Ошибка сети");
    } finally {
      setDeleting(false);
    }
  };

  const timeAgo = (date) => {
    const s = Math.floor((new Date() - new Date(date)) / 1000);
    if (s < 60) return 'только что';
    if (s < 3600) return Math.floor(s / 60) + ' мин.';
    if (s < 86400) return Math.floor(s / 3600) + ' ч.';
    return new Date(date).toLocaleDateString('ru-RU');
  };

  const renderMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code class="bg-stone-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-stone-900 text-green-400 p-4 rounded-lg overflow-x-auto my-4 text-sm"><code>$1</code></pre>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4 border border-stone-200" />')
      .replace(/\n/g, '<br/>');
  };

  const VoteBtn = ({ dir, targetType, targetId, count }) => {
    const key = vk(targetType, targetId);
    const active = votes[key] === (dir === 'up' ? 'UP' : 'DOWN');
    const isLoading = voteLoading === key;
    const isUp = dir === 'up';
    return (
      <button
        onClick={() => handleVote(dir, targetType, targetId)}
        disabled={isLoading}
        className={
          'flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all ' +
          (active
            ? isUp ? 'border-green-500 bg-green-50 text-green-600' : 'border-red-500 bg-red-50 text-red-600'
            : 'border-stone-200 hover:border-stone-300 text-stone-600')
        }
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : isUp ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
        {isUp && <span className="font-medium text-sm">{count ?? 0}</span>}
      </button>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="animate-pulse text-stone-500">Загрузка...</div>
    </div>
  );

  if (!question) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl text-stone-600">Вопрос не найден</h2>
        <button onClick={() => router.push('/questions')} className="mt-4 text-blue-600 hover:underline">← Вернуться к вопросам</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button onClick={() => router.push('/questions')} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mb-4">
          <ArrowLeft size={16} /> Все вопросы
        </button>

        <h1 className="text-2xl font-bold text-stone-800">{question.title}</h1>

        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-stone-500">
          <span className="flex items-center gap-1"><User size={14} /> {question.author?.name || 'Аноним'}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Clock size={14} /> {timeAgo(question.createdAt)}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Eye size={14} /> {question.views}</span>
          <span className="flex items-center gap-1"><MessageSquare size={14} /> {question._count?.answers || 0} ответов</span>
          {question.difficulty && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              question.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-700' :
              question.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {question.difficulty === 'BEGINNER' ? 'Начальный' : question.difficulty === 'INTERMEDIATE' ? 'Средний' : 'Продвинутый'}
            </span>
          )}
          {question.isAnswered && (
            <span className="flex items-center gap-1 text-green-600 font-medium"><CheckCircle2 size={14} /> Решено</span>
          )}
        </div>

        {session && (session.user.id === question.author?.id || session.user.role === "ADMIN") && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="mt-3 text-xs text-red-400 hover:text-red-600 transition disabled:opacity-50"
          >
            {deleting ? "Удаление..." : "Удалить вопрос"}
          </button>
        )}

        {question.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {question.tags.map(({ tag }) => (
              <span key={tag.id} className="px-2.5 py-1 text-xs rounded-full font-medium" style={{ backgroundColor: tag.color + '20', color: tag.color }}>
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 bg-white rounded-xl border border-stone-200 p-6">
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(question.body) }} />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <VoteBtn dir="up" targetType="question" targetId={question.id} count={question.voteCount} />
          <VoteBtn dir="down" targetType="question" targetId={question.id} />
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
            <MessageSquare size={20} /> {question._count?.answers || 0} {(question._count?.answers || 0) === 1 ? 'ответ' : 'ответов'}
          </h2>

          {question.answers?.length > 0 ? (
            <div className="space-y-4">
              {question.answers.map((answer) => (
                <div key={answer.id} className={`bg-white rounded-xl border p-6 ${answer.isAccepted ? 'border-green-300 ring-1 ring-green-200' : 'border-stone-200'}`}>
                  {answer.isAccepted && (
                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium mb-3">
                      <CheckCircle2 size={16} /> Принятый ответ
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-stone-700">{answer.author?.name || 'Аноним'}</span>
                    <span className="text-xs text-stone-400">{timeAgo(answer.createdAt)}</span>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(answer.body) }} />
                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-3">
                    <VoteBtn dir="up" targetType="answer" targetId={answer.id} count={answer.voteCount} />
                    <VoteBtn dir="down" targetType="answer" targetId={answer.id} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-stone-500 bg-white rounded-xl border border-dashed border-stone-300">
              Пока нет ответов. Будь первым!
            </div>
          )}
        </div>

        {session ? (
          <div className="mt-8 bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="font-semibold text-stone-800 mb-3">Ваш ответ</h3>
            <textarea
              value={answerBody}
              onChange={(e) => setAnswerBody(e.target.value)}
              placeholder="Напишите ваш ответ здесь... Поддерживается Markdown"
              rows={6}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-stone-400">Markdown поддерживается</span>
              <button
                onClick={handleAnswer}
                disabled={!answerBody.trim() || submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Отправка...' : 'Опубликовать ответ'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-white rounded-xl border border-stone-200 p-8 text-center">
            <p className="text-stone-500 mb-3">Войдите, чтобы ответить на вопрос</p>
            <Link href="/login" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Войти
            </Link>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-stone-200">
          <a href="/questions" className="text-sm text-blue-600 hover:underline">← Все вопросы</a>
          <span className="mx-2 text-stone-300">|</span>
          <a href="/questions/ask" className="text-sm text-blue-600 hover:underline">Задать свой вопрос →</a>
        </div>
      </div>
    </div>
  );
}
