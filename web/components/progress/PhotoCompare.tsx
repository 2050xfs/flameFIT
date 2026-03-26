'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, ChevronLeft, Loader2, X, Plus } from 'lucide-react';

interface Photo {
    id: string;
    url: string;
    date: string;
    label: string | null;
}

interface PhotoCompareProps {
    onBack: () => void;
}

export function PhotoCompare({ onBack }: PhotoCompareProps) {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [beforeIdx, setBeforeIdx] = useState(0);
    const [afterIdx, setAfterIdx] = useState(1);
    const [sliderVal, setSliderVal] = useState(50);
    const [view, setView] = useState<'compare' | 'gallery' | 'upload'>('gallery');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        setIsLoading(true);
        try {
            const { getProgressPhotosAction } = await import('@/app/progress/actions');
            const data = await getProgressPhotosAction();
            setPhotos(data);
        } catch (err) {
            console.error('Failed to load photos:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (file: File, label?: string) => {
        setIsUploading(true);
        setUploadError(null);
        try {
            const formData = new FormData();
            formData.append('photo', file);
            if (label) formData.append('label', label);
            formData.append('photo_date', new Date().toISOString().split('T')[0]);

            const { uploadProgressPhotoAction } = await import('@/app/progress/actions');
            const result = await uploadProgressPhotoAction(formData);
            const newPhoto: Photo = {
                id: result.id,
                url: result.url,
                date: new Date().toISOString().split('T')[0],
                label: label || null,
            };
            setPhotos(prev => [newPhoto, ...prev]);
            setView('gallery');
        } catch (err: any) {
            setUploadError(err.message || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const beforePhoto = photos[beforeIdx];
    const afterPhoto = photos[afterIdx];
    const canCompare = photos.length >= 2;

    return (
        <div className="min-h-screen bg-stone-950 text-white flex flex-col fixed inset-0 z-50 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <button onClick={onBack} className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Back</span>
                </button>
                <h2 className="font-bold text-lg">Progress Photos</h2>
                <button
                    onClick={() => setView('upload')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            {/* Tab bar */}
            <div className="flex bg-stone-900 border-b border-white/5">
                {['gallery', 'compare'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setView(tab as any)}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${view === tab ? 'text-orange-500 border-b-2 border-orange-500' : 'text-stone-500'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
            )}

            {/* Gallery View */}
            {!isLoading && view === 'gallery' && (
                <div className="flex-1 p-4">
                    {photos.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 rounded-3xl bg-stone-800 flex items-center justify-center mb-6">
                                <Camera className="w-10 h-10 text-stone-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No Photos Yet</h3>
                            <p className="text-stone-400 text-sm mb-8 max-w-xs">
                                Start documenting your transformation. Add your first progress photo now.
                            </p>
                            <button
                                onClick={() => setView('upload')}
                                className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors"
                            >
                                Add First Photo
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {photos.map((photo, idx) => (
                                <button
                                    key={photo.id}
                                    onClick={() => {
                                        if (idx === beforeIdx) return;
                                        setAfterIdx(beforeIdx);
                                        setBeforeIdx(idx);
                                    }}
                                    className="relative aspect-square rounded-2xl overflow-hidden group"
                                >
                                    <img
                                        src={photo.url}
                                        alt={photo.label || photo.date}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                                    <div className="absolute bottom-2 left-2 right-2">
                                        <p className="text-xs font-bold text-white bg-black/50 rounded px-2 py-0.5 truncate">
                                            {photo.label || new Date(photo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Compare View */}
            {!isLoading && view === 'compare' && (
                <div className="flex-1 flex flex-col">
                    {!canCompare ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <p className="text-stone-400 mb-4">You need at least 2 photos to compare.</p>
                            <button
                                onClick={() => setView('upload')}
                                className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold"
                            >
                                Add Photos
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 relative overflow-hidden m-4 rounded-3xl select-none touch-none">
                                {/* After photo (base layer) */}
                                <div
                                    className="absolute inset-0 bg-stone-800 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${afterPhoto?.url})` }}
                                >
                                    <div className="absolute bottom-6 right-6 px-3 py-1 bg-black/60 backdrop-blur rounded text-xs font-bold">
                                        {afterPhoto?.label || new Date(afterPhoto?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>

                                {/* Before photo (clipped) */}
                                <div
                                    className="absolute inset-0 bg-stone-600 bg-cover bg-center border-r-2 border-white/80 shadow-[2px_0_20px_rgba(0,0,0,0.5)]"
                                    style={{
                                        backgroundImage: `url(${beforePhoto?.url})`,
                                        width: `${sliderVal}%`
                                    }}
                                >
                                    <div className="absolute bottom-6 left-6 px-3 py-1 bg-black/60 backdrop-blur rounded text-xs font-bold">
                                        {beforePhoto?.label || new Date(beforePhoto?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>

                                {/* Drag handle */}
                                <div
                                    className="absolute top-0 bottom-0 w-12 -ml-6 cursor-ew-resize flex items-center justify-center"
                                    style={{ left: `${sliderVal}%` }}
                                    onMouseMove={e => {
                                        if (e.buttons !== 1) return;
                                        const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                                        if (rect) {
                                            setSliderVal(Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100)));
                                        }
                                    }}
                                    onTouchMove={e => {
                                        const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                                        if (rect) {
                                            setSliderVal(Math.max(5, Math.min(95, ((e.touches[0].clientX - rect.left) / rect.width) * 100)));
                                        }
                                    }}
                                >
                                    <div className="w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center text-stone-900 text-lg pointer-events-none">
                                        ↔
                                    </div>
                                </div>
                            </div>

                            {/* Photo selectors */}
                            <div className="flex gap-3 px-4 pb-6">
                                {['Before', 'After'].map((label, i) => {
                                    const idx = i === 0 ? beforeIdx : afterIdx;
                                    const photo = photos[idx];
                                    return (
                                        <div key={label} className="flex-1">
                                            <p className="text-xs font-bold text-stone-500 uppercase mb-2">{label}</p>
                                            <div className="flex gap-2 overflow-x-auto">
                                                {photos.map((p, pi) => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => i === 0 ? setBeforeIdx(pi) : setAfterIdx(pi)}
                                                        className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${pi === idx ? 'border-orange-500' : 'border-transparent opacity-50'}`}
                                                    >
                                                        <img src={p.url} alt="" className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Upload View */}
            {view === 'upload' && (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="w-full max-w-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <button onClick={() => setView('gallery')} className="text-stone-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                            <h3 className="text-xl font-bold">Add Progress Photo</h3>
                        </div>

                        {uploadError && (
                            <div className="mb-4 p-3 bg-rose-900/30 text-rose-400 text-sm rounded-xl">
                                {uploadError}
                            </div>
                        )}

                        {isUploading ? (
                            <div className="text-center py-12">
                                <Loader2 className="w-10 h-10 animate-spin text-orange-500 mx-auto mb-4" />
                                <p className="text-stone-400 text-sm">Uploading photo...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full aspect-square rounded-3xl border-2 border-dashed border-stone-700 hover:border-orange-500 flex flex-col items-center justify-center gap-4 transition-colors group"
                                >
                                    <Upload className="w-12 h-12 text-stone-600 group-hover:text-orange-500 transition-colors" />
                                    <span className="text-stone-400 group-hover:text-white text-sm font-medium">
                                        Tap to choose photo
                                    </span>
                                    <span className="text-xs text-stone-600">JPG, PNG, WEBP up to 10 MB</span>
                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="user"
                                    className="hidden"
                                    onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const labelInput = document.getElementById('photo-label') as HTMLInputElement;
                                            handleUpload(file, labelInput?.value || undefined);
                                        }
                                        e.target.value = '';
                                    }}
                                />

                                <div>
                                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                                        Label (optional)
                                    </label>
                                    <input
                                        id="photo-label"
                                        type="text"
                                        placeholder="e.g. Week 4, Front"
                                        className="w-full bg-stone-800 border border-stone-700 rounded-2xl px-4 py-3 text-white outline-none focus:ring-2 ring-orange-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
