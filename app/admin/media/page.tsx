"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Upload,
  Trash2,
  Copy,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";

interface MediaImage {
  url: string;
  name: string;
  size?: string;
  uploadedAt?: string;
}

const MediaPage = () => {
  const [images, setImages] = useState<MediaImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MediaImage | null>(null);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ✅ fetchImages memorizada para evitar errores de dependencias
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/media");
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Ett okänt fel inträffade";
      setError(errorMsg);
      showNotification("Misslyckades med att ladda bilder", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showNotification("Bild-URL kopierad till urklipp!", "success");
  };

  const handleDelete = async (name: string) => {
    if (!confirm("Är du säker på att du vill ta bort denna bild?")) return;

    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Misslyckades med att ta bort bild");

      setImages(prev => prev.filter((img) => img.name !== name));
      showNotification("Bilden togs bort framgångsrikt!", "success");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Ett fel inträffade";
      showNotification(errorMsg, "error");
    }
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        showNotification(`Hoppade över: ${file.name} (inte en bild)`, "error");
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/media", { method: "POST", body: formData });
        
        if (!res.ok) throw new Error("Misslyckades med att ladda upp");

        const newImage = await res.json();
        setImages(prev => [newImage, ...prev]);
        showNotification(`${file.name} har laddats upp!`, "success");
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Ett fel inträffade vid uppladdning";
        showNotification(errorMsg, "error");
      }
    }
    setUploading(false);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files?.length) {
      await uploadFiles(Array.from(files));
      event.target.value = ""; 
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) {
      await uploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className="container mx-auto min-h-screen p-6">
      <button 
        className="mb-4 bg-blue-200 hover:bg-blue-300 px-4 py-2 rounded-lg transition-colors" 
        onClick={() => window.history.back()}
      >
        ← Gå tillbaka
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mediebibliotek</h1>
        <p className="text-gray-600 mt-2">Ladda upp och hantera dina bilder för duddallos</p>
      </div>

      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 mb-8 transition-all ${
          dragActive ? "border-blue-500 bg-blue-50 border-solid" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          multiple
          disabled={uploading}
        />
        <label 
          htmlFor="file-upload" 
          className={`cursor-pointer flex flex-col items-center justify-center ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-blue-500" />
            )}
          </div>
          <p className="text-lg font-medium text-gray-700 mb-2">
            {uploading ? "Laddar upp..." : "Dra och släpp filer här"}
          </p>
          <p className="text-gray-500 mb-4">eller klicka för att bläddra</p>
          <p className="text-sm text-gray-400">Stöder: JPG, PNG, GIF, WebP (max 5MB)</p>
        </label>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
          notification.type === 'success'
            ? 'bg-green-50 text-green-800 border-green-200'
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <p className="font-medium text-red-800">Fel vid laddning</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">{images.length} {images.length === 1 ? 'bild' : 'bilder'}</span>
          </div>

          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {images.map((image) => (
                <div key={image.name} className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md border border-gray-200">
                  <div className="aspect-square relative cursor-pointer" onClick={() => setSelectedImage(image)}>
                    <Image src={image.url} alt={image.name} fill sizes="200px" className="object-cover hover:scale-105 transition-transform" />
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleCopyUrl(image.url); }} className="bg-white/90 hover:bg-white p-2 rounded-full" title="Kopiera URL">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(image.name); }} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full" title="Ta bort">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">{image.name}</p>
                    {image.size && <p className="text-xs text-gray-500">{image.size}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Inga bilder än</h3>
              <p className="text-gray-500 mb-6">Ladda upp din första bild för att komma igång</p>
              <label htmlFor="file-upload" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Ladda upp bilder
              </label>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium truncate pr-4">{selectedImage.name}</h3>
              <button onClick={() => setSelectedImage(null)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative aspect-video w-full bg-gray-100 rounded">
                <Image src={selectedImage.url} alt={selectedImage.name} fill className="object-contain" />
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={() => handleCopyUrl(selectedImage.url)} className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
                  <Copy className="w-4 h-4" /> Kopiera URL
                </button>
                <button onClick={() => { handleDelete(selectedImage.name); setSelectedImage(null); }} className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg">
                  <Trash2 className="w-4 h-4" /> Ta bort
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;