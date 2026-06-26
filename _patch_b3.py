import re

with open("src/app/page.jsx", "r", encoding="utf-8") as f:
    c = f.read()

# 1. useSession in AddResourceModal
c = c.replace(
    'function AddResourceModal({ isOpen, onClose, categories, onSuccess }) {\n  const [name, setName] = useState("");',
    'function AddResourceModal({ isOpen, onClose, categories, onSuccess }) {\n  const { data: session } = useSession();\n  const [name, setName] = useState("");'
)

# 2. Improved success in AddResourceModal
c = c.replace(
    '      if (response.ok) {\n        setName(""); setDescription(""); setUrl("");\n        onSuccess();\n        onClose();',
    '      if (response.ok) {\n        const data = await response.json();\n        setName(""); setDescription(""); setUrl(""); setCategoryId("");\n        onSuccess();\n        onClose();\n        alert(data.message || "Ресурс добавлен");'
)

# 3. useSession in AddTermModal
c = c.replace(
    'function AddTermModal({ isOpen, onClose, onSuccess }) {\n  const [term, setTerm] = useState("");',
    'function AddTermModal({ isOpen, onClose, onSuccess }) {\n  const { data: session } = useSession();\n  const [term, setTerm] = useState("");'
)

# 4. useSession in Home
c = re.sub(
    r"(export default function Home\(\) \{\n)",
    r"\1  const { data: session } = useSession();\n",
    c
)

# 5. Button + auth
old_btn = """{/* Плавающая кнопка добавления */}
<button
  onClick={() => setIsResourceModalOpen(true)}
  className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
>
  <Plus className="w-6 h-6" />
</button>"""

new_btn = """{/* Плавающая кнопка добавления */}
{session ? (
  <button
    onClick={() => setIsResourceModalOpen(true)}
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
  >
    <Plus className="w-6 h-6" />
  </button>
) : (
  <Link
    href="/login"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
  >
    <Plus className="w-6 h-6" />
  </Link>
)}"""

c = c.replace(old_btn, new_btn)

with open("src/app/page.jsx", "w", encoding="utf-8") as f:
    f.write(c)
print("OK")
