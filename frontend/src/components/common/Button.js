export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 active:scale-95 disabled:opacity-50';

    const variants = {
        primary: 'bg-teal-600 hover:bg-teal-700 text-white shadow-md hover:shadow-lg',
        secondary: 'bg-teal-50 hover:bg-teal-100 text-teal-700',
        outline: 'border border-slate-200 text-slate-700 hover:bg-slate-50',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-6 py-3.5 text-base',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}