
import React, { useCallback } from 'react';
import { MediaItem } from '../types';

interface MediaUploadProps {
  onMediaAdded: (items: MediaItem[]) => void;
  mediaItems: MediaItem[];
  onRemove: (index: number) => void;
  disabled: boolean;
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onMediaAdded, mediaItems, onRemove, disabled }) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // FIX: Explicitly cast to File[] to prevent 'unknown' type inference which causes errors with URL.createObjectURL and file properties
      const newFiles = Array.from(e.target.files) as File[];
      const newItems: MediaItem[] = newFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image'
      }));
      onMediaAdded(newItems);
    }
  }, [onMediaAdded]);

  return (
    <div className="space-y-4">
      <div className={`relative border-2 border-dashed rounded-2xl p-8 transition-colors ${
        disabled ? 'bg-gray-100 border-gray-300' : 'bg-emerald-50 border-emerald-200 hover:border-emerald-400'
      }`}>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
            <i className="fa-solid fa-cloud-arrow-up text-emerald-500 text-2xl"></i>
          </div>
          <div>
            <p className="text-lg font-semibold text-emerald-900">Upload Plant Photos or Videos</p>
            <p className="text-sm text-emerald-600">Snap a clear photo of the leaves, stems, or pests</p>
          </div>
          <button 
            type="button"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            Select Files
          </button>
        </div>
      </div>

      {mediaItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {mediaItems.map((item, idx) => (
            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-200 border border-gray-100 shadow-sm">
              {item.type === 'image' ? (
                <img src={item.preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <i className="fa-solid fa-video text-white text-3xl"></i>
                </div>
              )}
              <button
                onClick={() => onRemove(idx)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUpload;
