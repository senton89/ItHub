"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (!email || !password) {
      setError("Email и пароль обязательны");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Ошибка при регистрации");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Регистрация прошла, но не удалось войти. Попробуйте войти вручную.");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Fix<span className="text-blue-600">Lib</span>
          </Link>
          <p className="text-stone-500 text-sm mt-2">
            Создайте аккаунт
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-stone-200 p-6 space-y-4"
        >
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Имя
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              placeholder="Иван Иванов"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              placeholder="Минимум 6 символов"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-stone-700 mb-1.5"
            >
              Подтвердите пароль
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="text-center text-sm text-stone-500 mt-4">
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
