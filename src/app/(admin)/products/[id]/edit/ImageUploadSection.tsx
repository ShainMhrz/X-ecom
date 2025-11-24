'use client';

import { useState } from 'react';

interface Image {
  id: string;
  url: string;
  altText: string | null;
}

interface Props {
  productId: string;
  productTitle: string;
  images: Image[];
}

export default function ImageUploadSection({ productId, productTitle, images }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const handleDelete = async (imageId: string) => {
    if (!confirm('Delete this image?')) return;
    
    try {
      await fetch(`/api/admin/products/${productId}/images?imageId=${imageId}`, {
        method: 'DELETE',
      });
      window.location.reload();
    } catch (error) {
      alert('Failed to delete image');
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    setIsUploading(true);
    
    try {
      await fetch(`/api/admin/products/${productId}/images`, {
        method: 'POST',
        body: formData,
      });
      window.location.reload();
    } catch (error) {
      alert('Upload failed');
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Product Images</h2>
      
      {/* Existing Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border bg-muted">
              <img 
                src={img.url} 
                alt={img.altText || productTitle} 
                className="w-full aspect-square object-cover"
              />
              <button
                type="button"
                onClick={() => handleDelete(img.id)}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload New Images */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border space-y-3">
        <p className="text-sm font-medium text-foreground">Upload New Images</p>
        <form onSubmit={handleUpload} className="space-y-3">
          <input 
            type="file" 
            name="images" 
            accept="image/*"
            multiple
            className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer cursor-pointer"
          />
          <button 
            type="submit"
            disabled={isUploading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload Images'}
          </button>
        </form>
      </div>
    </div>
  );
}
