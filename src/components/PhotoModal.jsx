import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle, Image as ImageIcon, Download, ExternalLink, Trash2 } from 'lucide-react';

const PhotoModal = ({ event, onClose, onUpload, onDelete }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const [uploadedPhotos, setUploadedPhotos] = useState(event.images || []);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const fileInputRef = useRef(null);

    // Sync newly uploaded photos back if the parent updates them
    React.useEffect(() => {
        setUploadedPhotos(event.images || []);
    }, [event.images]);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            processFiles(files);
        }
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            processFiles(files);
        }
    };

    const processFiles = (files) => {
        // Determine if they are images
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length === 0) return;

        // Simulate upload process
        setIsUploading(true);
        setIsSuccess(false);
        setUploadProgress(0);

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress >= 100) {
                clearInterval(interval);
                setUploadProgress(100);
                finishUpload(imageFiles);
            } else {
                setUploadProgress(progress);
            }
        }, 200);
    };

    const finishUpload = (files) => {
        setIsUploading(false);
        setIsSuccess(true);

        // Convert to local object URLs to display immediately (Mocking the process)
        const newPhotos = files.map(file => URL.createObjectURL(file));

        // Pass to parent or update local state if no parent handler
        if (onUpload) {
            onUpload(newPhotos);
        } else {
            setUploadedPhotos(prev => [...prev, ...newPhotos]);
        }

        // IMPORTANT NOTE FOR BACKEND MIGRATION:
        // When moving to Google Cloud Run, replace the above logic with an API call:
        // 1. Create FormData object and append the files.
        // 2. fetch('/api/upload', { method: 'POST', body: formData })
        // 3. The backend should upload to a Google Cloud Storage bucket and return public URLs.
        // 4. Use the returned URLs in setUploadedPhotos instead of URL.createObjectURL.

        setTimeout(() => {
            setIsSuccess(false);
            setUploadProgress(0);
        }, 3000);
    };

    const handleDownload = (e, url) => {
        e.stopPropagation();
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = (url) => {
        if (window.confirm('Möchten Sie dieses Foto wirklich löschen?')) {
            if (onDelete) {
                onDelete(url);
            } else {
                setUploadedPhotos(prev => prev.filter(p => p !== url));
            }
            setSelectedPhoto(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-3xl relative flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Fotos: {event.title}</h2>
                        <p className="text-white/60 text-sm mt-1">{event.date} • {event.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">

                    {/* Upload Zone */}
                    <section>
                        <h3 className="text-xl font-semibold text-white mb-4">Fotos hochladen</h3>
                        <div
                            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer
                ${isUploading ? 'border-white/20 bg-white/5 cursor-wait' : 'border-white/30 hover:border-white/60 hover:bg-white/10 bg-white/5'}`}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                            />

                            {isUploading ? (
                                <div className="w-full max-w-md">
                                    <div className="flex justify-between text-sm mb-2 text-white/80">
                                        <span>Hochladen...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-400 transition-all duration-200 ease-out"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            ) : isSuccess ? (
                                <div className="flex flex-col items-center animate-in zoom-in">
                                    <CheckCircle size={48} className="text-green-400 mb-4" />
                                    <span className="text-lg font-medium text-green-100">Erfolgreich hochgeladen!</span>
                                </div>
                            ) : (
                                <>
                                    <Upload size={48} className="text-white/50 mb-4" />
                                    <p className="text-lg font-medium text-white/90">Senden Sie uns die Fotos und wir laden sie hoch!</p>
                                    <p className="text-sm text-white/50 mt-2">JPG, PNG (max. 10MB pro Bild)</p>
                                </>
                            )}
                        </div>
                    </section>

                    {/* Polaroid Gallery */}
                    <section>
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <ImageIcon className="text-white/70" />
                            Galerie ({uploadedPhotos.length})
                        </h3>

                        {uploadedPhotos.length === 0 ? (
                            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-white/50">Noch keine Fotos vorhanden!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {uploadedPhotos.map((url, i) => (
                                    <div
                                        key={url + i}
                                        className="bg-white p-3 pb-12 rounded-lg shadow-xl shadow-black/20 transform hover:scale-105 hover:-rotate-1 transition-all duration-300 cursor-pointer group relative"
                                        onClick={() => setSelectedPhoto(url)}
                                    >
                                        <div className="aspect-square bg-slate-100 rounded overflow-hidden">
                                            <img src={url} alt={`Hochgeladenes Foto ${i + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                                            <ExternalLink size={32} className="text-white drop-shadow-lg" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                </div>
            </div>

            {/* Enlarged Photo Overlay */}
            {selectedPhoto && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300">
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        onClick={() => setSelectedPhoto(null)}
                    />
                    <div className="relative max-w-full max-h-full flex flex-col items-center gap-4">
                        <img
                            src={selectedPhoto}
                            alt="Vergrößertes Foto"
                            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-white/10"
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={(e) => handleDownload(e, selectedPhoto)}
                                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-all shadow-xl"
                            >
                                <Download size={20} />
                                Bild herunterladen
                            </button>
                            <button
                                onClick={() => handleDelete(selectedPhoto)}
                                className="flex items-center gap-2 px-6 py-3 bg-red-500/80 text-white rounded-full font-bold hover:bg-red-500 transition-all shadow-xl backdrop-blur-md"
                            >
                                <Trash2 size={20} />
                                Löschen
                            </button>
                            <button
                                onClick={() => setSelectedPhoto(null)}
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-all border border-white/20 backdrop-blur-md"
                            >
                                <X size={20} />
                                Schließen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotoModal;
