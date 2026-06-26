"use client";
import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function ImageUploader({ onImageUpload, maxImages = 3 }) {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = async (files) => {
    const validFiles = Array.from(files).slice(0, maxImages - images.length);
    
    for (const file of validFiles) {
      if (!file.type.startsWith('image/')) {
        alert('Только изображения!');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Макс. 5MB');
        continue;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        
        if (data.url) {
          const newImg = { url: data.url, preview: URL.createObjectURL(file) };
          setImages(prev => [...prev, newImg]);
          onImageUpload?.(data.url);
        } else {
          alert(data.error || 'Ошибка загрузки');
        }
      } catch (err) {
        alert('Ошибка сети');
      }
      setUploading(false);
    }
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-stone-300 hover:border-stone-400'
        } ${images.length >= maxImages ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={maxImages > 1}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
        ) : (
          <>
            <Upload className="mx-auto h-8 w-8 text-stone-400 mb-2" />
            <p className="text-sm text-stone-600">
              Перетащите изображения или <span className="text-blue-600 font-medium">выберите</span>
            </p>
            <p className="text-xs text-stone-400 mt-1">JPEG, PNG, GIF, WebP • Макс. 5MB</p>
          </>
        )}
      </div>

      {/* Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative group">
              <img src={img.preview} alt="" className="w-full h-24 object-cover rounded border" />
              <button
                onClick={() => removeImage(idx)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
