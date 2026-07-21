export default function Badge({ children, variant = 'teal', className = '' }) {
    const variants = {
        teal: 'bg-teal-600 text-white',
        green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        amber: 'bg-amber-50 text-amber-700 border border-amber-200',
    };

    return (
        <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}