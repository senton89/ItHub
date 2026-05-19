'use client';
import Link from 'next/link';
import { Eye, MessageSquare, ThumbsUp, CheckCircle2 } from 'lucide-react';

function timeAgo(date) {
  const s = Math.floor((new Date() - new Date(date)) / 1000);
  if (s < 60) return 'только что';
  if (s < 3600) return Math.floor(s / 60) + ' мин.';
  if (s < 86400) return Math.floor(s / 3600) + ' ч.';
  return Math.floor(s / 86400) + ' д.';
}

export default function QuestionCard({ question }) {
  return (
    <Link href={`/questions/${question.slug}`} className="block group">
      <div className="bg-white rounded-xl border border-stone-200 hover:border-rose-300 hover:shadow-md transition-all p-5">
        <div className="flex gap-4">
          {/* Голоса */}
          <div className="flex flex-col items-center min-w-[50px] text-center">
            <span className="text-xl font-bold text-stone-700">{question.voteCount}</span>
            <span className="text-xs text-stone-500">голосов</span>
            <span className="text-lg font-semibold text-stone-600 mt-2">{question._count.answers}</span>
            <span className="text-xs text-stone-500">ответов</span>
            {question.isAnswered && (
              <CheckCircle2 size={18} className="text-green-600 mt-2" />
            )}
          </div>

          {/* Контент */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-stone-800 group-hover:text-rose-600 transition-colors line-clamp-2">
              {question.title}
            </h3>

            {/* Теги */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {question.tags.map(({ tag }) => (
                <span key={tag.id} className="px-2 py-0.5 text-xs rounded-full font-medium" style={{ backgroundColor: `${tag.color}20`, color: tag.color }}>
                  {tag.name}
                </span>
              ))}
              {question.difficulty && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-stone-100 text-stone-600">
                  {question.difficulty === 'BEGINNER' ? '🟢 Начальный' : question.difficulty === 'INTERMEDIATE' ? '🟡 Средний' : '🔴 Продвинутый'}
                </span>
              )}
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between mt-3 text-xs text-stone-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye size={13} /> {question.views}
                </span>
                <span>•</span>
                <span>{timeAgo(question.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-stone-700">{question.author.name}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  question.author.badge === 'GOLD' ? 'bg-yellow-100 text-yellow-700' :
                  question.author.badge === 'SILVER' ? 'bg-stone-200 text-stone-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {question.author.badge}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
