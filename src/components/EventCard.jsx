import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Clock, Calendar, Image as ImageIcon } from 'lucide-react';

const EventCard = ({ event, onOpenPhotos }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="glass rounded-2xl p-6 mb-6 transition-all duration-300 hover:shadow-2xl hover:bg-white/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
                        <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                            <Calendar size={14} />
                            {event.date}
                        </span>
                        <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                            <Clock size={14} />
                            {event.time}
                        </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>

                    <div className="flex items-start gap-2 text-white/90">
                        <MapPin size={18} className="mt-0.5 shrink-0" />
                        <span>{event.location}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between md:flex-col gap-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenPhotos(event);
                        }}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/30 transition-colors border border-white/30 px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-md"
                    >
                        <ImageIcon size={16} />
                        Fotos ansehen / hinzufügen
                    </button>

                    <button className="text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors">
                        {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </button>
                </div>
            </div>

            <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="pt-4 border-t border-white/20">
                        <h4 className="text-lg font-semibold mb-2">Kurzbeschreibung</h4>
                        <p className="text-white/90 leading-relaxed">
                            {event.shortDescription || "Details folgen..."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
