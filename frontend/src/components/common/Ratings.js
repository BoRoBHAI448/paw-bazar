import { Star } from 'lucide-react';

export default function Rating({ value = 4.8, reviews = null }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(value) ? 'fill-amber-400' : 'text-slate-200'}`} />
                ))}
            </div>
            <span className="text-xs font-bold text-slate-700">{value}</span>
            {reviews && <span className="text-xs text-slate-400">({reviews})</span>}
        </div>
    );
}