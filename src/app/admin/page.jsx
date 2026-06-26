"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check, X, Loader2, Shield, ArrowLeft, Inbox,
  Plus, Pencil, Trash2, Search, Folder, LinkIcon, BookOpen
} from "lucide-react";

const PLURAL = { category: "categories", resource: "resources", term: "terms" };

const COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899",
  "#ef4444", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
  "#14b8a6", "#e11d48", "#0ea5e9", "#a855f7", "#22c55e",
  "#eab308", "#64748b", "#1e293b",
];

const TABS = [
  { key: "pending", label: "Модерация", icon: Shield, fields: [] },
  {
    key: "category", label: "Категории", icon: Folder,
    fields: [
      { key: "name", label: "Название", required: true },
      { key: "description", label: "Описание", textarea: true },
      { key: "color", label: "Цвет", type: "color-picker" },
    ],
  },
  {
    key: "resource", label: "Ресурсы", icon: LinkIcon,
    fields: [
      { key: "name", label: "Название", required: true },
      { key: "description", label: "Описание", textarea: true, required: true },
      { key: "url", label: "URL" },
      { key: "categoryId", label: "Категория", type: "category-select" },
      { key: "tags", label: "Теги" },
      { key: "isFeatured", label: "Избранное", type: "checkbox" },
    ],
  },
  {
    key: "term", label: "Термины", icon: BookOpen,
    fields: [
      { key: "term", label: "Термин", required: true },
      { key: "definition", label: "Определение", textarea: true, required: true },
      { key: "examples", label: "Примеры", textarea: true },
      { key: "categoryId", label: "Категория", type: "category-select" },
    ],
  },
];

function getTabConfig(key) {
  return TABS.find((t) => t.key === key) || { fields: [] };
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState("pending");
  const [data, setData] = useState({
    categories: [], resources: [], terms: [],
    pendingCategories: [], pendingResources: [],
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [showCreate, setShowCreate] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "ADMIN") router.push("/");
  }, [status, session, router]);

  const fetchAll = useCallback(async () => {
    try {
      const [pendingRes, catRes, resRes, termRes] = await Promise.all([
        fetch("/api/admin/pending"),
        fetch("/api/categories?all=true"),
        fetch("/api/resources?all=true"),
        fetch("/api/terms?all=true"),
      ]);
      const [pending, categories, resources, terms] = await Promise.all([
        pendingRes.json(), catRes.json(), resRes.json(), termRes.json(),
      ]);
      setData({
        categories: Array.isArray(categories) ? categories : [],
        resources: Array.isArray(resources) ? resources : [],
        terms: Array.isArray(terms) ? terms : [],
        pendingCategories: pending?.categories || [],
        pendingResources: pending?.resources || [],
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") fetchAll();
  }, [session, fetchAll]);

  async function handleAction(type, id, action) {
    setActionLoading(`${type}-${id}`);
    try {
      const res = await fetch(`/api/admin/action/${type}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) fetchAll();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(type, id) {
    if (!confirm("Удалить?")) return;
    setActionLoading(`del-${type}-${id}`);
    try {
      const plural = PLURAL[type] || type + "s";
      const res = await fetch(`/api/${plural}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEditItem(null);
        fetchAll();
      } else {
        const err = await res.json();
        alert(err.error || "Ошибка удаления");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSave(type, id, body) {
    setActionLoading(`save-${type}-${id}`);
    try {
      const plural = PLURAL[type] || type + "s";
      const res = await fetch(`/api/${plural}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setEditItem(null);
        fetchAll();
      } else {
        const err = await res.json();
        alert(err.error || "Ошибка сохранения");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCreate(type, body) {
    setActionLoading(`create-${type}`);
    try {
      const plural = PLURAL[type] || type + "s";
      const res = await fetch(`/api/${plural}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowCreate(null);
        fetchAll();
      } else {
        const err = await res.json();
        alert(err.error || "Ошибка создания");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
      </div>
    );
  }

  const totalPending = data.pendingCategories.length + data.pendingResources.length;

  function filterList(list, field = "name") {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (item) =>
        (item[field] || "").toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q)
    );
  }

  const activeKey = editItem?.type || showCreate;
  const activeFields = getTabConfig(activeKey).fields;

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 text-stone-500 hover:text-stone-800 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Панель администратора
              </h1>
              <p className="text-sm text-stone-500">
                {session?.user?.name}
                {totalPending > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {totalPending} на модерации
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto pb-px">
          {TABS.map((t) => {
            const Icon = t.icon;
            const count = t.key === "pending" ? totalPending : 0;
            return (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key);
                  setSearch("");
                  setEditItem(null);
                  setShowCreate(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  tab === t.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
                {count > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {tab === "pending" && (
          <PendingTab data={data} actionLoading={actionLoading} onAction={handleAction} />
        )}
        {tab === "category" && (
          <CrudTab
            items={filterList(data.categories)}
            type="category"
            search={search}
            onSearch={setSearch}
            actionLoading={actionLoading}
            editItem={editItem}
            setEditItem={setEditItem}
            showCreate={showCreate}
            setShowCreate={setShowCreate}
            onSave={handleSave}
            onDelete={handleDelete}
            onCreate={handleCreate}
            fields={getTabConfig("category").fields}
          />
        )}
        {tab === "resource" && (
          <CrudTab
            items={filterList(data.resources)}
            type="resource"
            search={search}
            onSearch={setSearch}
            actionLoading={actionLoading}
            editItem={editItem}
            setEditItem={setEditItem}
            showCreate={showCreate}
            setShowCreate={setShowCreate}
            onSave={handleSave}
            onDelete={handleDelete}
            onCreate={handleCreate}
            fields={getTabConfig("resource").fields}
            extra={(item) =>
              item.category?.name && (
                <span className="text-xs text-stone-400">Категория: {item.category.name}</span>
              )
            }
          />
        )}
        {tab === "term" && (
          <CrudTab
            items={filterList(data.terms, "term")}
            type="term"
            search={search}
            onSearch={setSearch}
            actionLoading={actionLoading}
            editItem={editItem}
            setEditItem={setEditItem}
            showCreate={showCreate}
            setShowCreate={setShowCreate}
            onSave={handleSave}
            onDelete={handleDelete}
            onCreate={handleCreate}
            fields={getTabConfig("term").fields}
          />
        )}
      </main>

      {(editItem || showCreate) && (
        <EditModal
          item={editItem}
          type={activeKey}
          fields={activeFields}
          categories={data.categories}
          actionLoading={actionLoading}
          onSave={editItem ? handleSave : handleCreate}
          onClose={() => {
            setEditItem(null);
            setShowCreate(null);
          }}
        />
      )}
    </div>
  );
}

function PendingTab({ data, actionLoading, onAction }) {
  const items = [
    ...data.pendingCategories.map((i) => ({ ...i, _type: "category" })),
    ...data.pendingResources.map((i) => ({ ...i, _type: "resource" })),
  ];

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
        <Inbox className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <p className="text-stone-500">Нет записей на модерации</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const key = `${item._type}-${item.id}`;
        const isLoading = actionLoading === key;
        return (
          <div
            key={`${item._type}-${item.id}`}
            className="bg-white rounded-xl border border-stone-200 p-4 flex items-start justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                  {item._type === "category" ? "Категория" : "Ресурс"}
                </span>
                <p className="font-medium text-stone-800 truncate">{item.name}</p>
              </div>
              {item.description && (
                <p className="text-sm text-stone-500 mt-1 line-clamp-2">{item.description}</p>
              )}
              {item._type === "resource" && item.category && (
                <p className="text-xs text-stone-400 mt-1">Категория: {item.category.name}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onAction(item._type, item.id, "approve")}
                disabled={isLoading}
                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition disabled:opacity-50"
                title="Одобрить"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onAction(item._type, item.id, "reject")}
                disabled={isLoading}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                title="Отклонить"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CrudTab({
  items, type, search, onSearch, actionLoading,
  editItem, setEditItem, showCreate, setShowCreate,
  onSave, onDelete, onCreate, fields, extra,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>
        <button
          onClick={() => setShowCreate(type)}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Добавить
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500 text-sm">
          {search ? "Ничего не найдено" : "Список пуст"}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
          {items.map((item) => {
            const name = item.name || item.term || "—";
            const isLoading = actionLoading === `del-${type}-${item.id}`;
            return (
              <div key={item.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {item.color && (
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    )}
                    <p className="font-medium text-stone-800 truncate">{name}</p>
                  </div>
                  {item.description && (
                    <p className="text-sm text-stone-500 truncate">{item.description}</p>
                  )}
                  {item.definition && (
                    <p className="text-sm text-stone-500 truncate">{item.definition}</p>
                  )}
                  {extra?.(item)}
                  {item.status && item.status !== "APPROVED" && (
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                      {item.status}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setEditItem({ ...item, type })}
                    className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition"
                    title="Редактировать"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(type, item.id)}
                    disabled={isLoading}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                    title="Удалить"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EditModal({ item, type, fields, categories, actionLoading, onSave, onClose }) {
  const [form, setForm] = useState(() => {
    if (!item) return {};
    const initial = {};
    fields.forEach((f) => {
      initial[f.key] = item[f.key] ?? (f.type === "checkbox" ? false : "");
    });
    return initial;
  });

  function handleSubmit(e) {
    e.preventDefault();
    const body = { ...form };
    if (body.order) body.order = parseInt(body.order) || 0;
    if (body.isFeatured !== undefined) body.isFeatured = !!body.isFeatured;
    if (body.categoryId === "") body.categoryId = null;

    if (item) {
      onSave(type, item.id, body);
    } else {
      onSave(type, body);
    }
  }

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const isLoading = actionLoading?.startsWith(item ? "save" : "create");

  if (!fields || fields.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
        <div className="bg-white rounded-xl border border-stone-200 w-full max-w-lg p-8 text-center" onClick={(e) => e.stopPropagation()}>
          <p className="text-stone-500">Нет полей для редактирования</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 text-sm text-stone-600 hover:text-stone-800">
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl border border-stone-200 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h3 className="font-semibold text-stone-800">{item ? "Редактировать" : "Создать"}</h3>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">{f.label}</label>
              {f.type === "checkbox" ? (
                <input
                  type="checkbox"
                  checked={!!form[f.key]}
                  onChange={(e) => setField(f.key, e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300"
                />
              ) : f.type === "color-picker" ? (
                <div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setField(f.key, color)}
                        className="w-8 h-8 rounded-lg border-2 transition-all hover:scale-110"
                        style={{
                          backgroundColor: color,
                          borderColor: form[f.key] === color ? "#1e293b" : "transparent",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400">Или укажите HEX:</span>
                    <input
                      type="text"
                      value={form[f.key] || ""}
                      onChange={(e) => setField(f.key, e.target.value)}
                      placeholder="#3b82f6"
                      className="w-28 px-2 py-1 border border-stone-200 rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    />
                    {form[f.key] && (
                      <span
                        className="w-6 h-6 rounded border border-stone-200"
                        style={{ backgroundColor: form[f.key] }}
                      />
                    )}
                  </div>
                </div>
              ) : f.type === "category-select" ? (
                <select
                  value={form[f.key] || ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-white"
                >
                  <option value="">— Без категории —</option>
                  {Array.isArray(categories) &&
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              ) : f.textarea ? (
                <textarea
                  value={form[f.key] || ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                  required={f.required}
                  rows={3}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-none"
                />
              ) : (
                <input
                  type={f.type || "text"}
                  value={form[f.key] || ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                  required={f.required}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-stone-600 hover:text-stone-800 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Сохранение...
                </span>
              ) : item ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
