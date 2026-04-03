"use client";

interface TextAreaProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    error?: string;
}

export default function TextArea({
    label,
    value,
    onChange,
    placeholder,
    rows = 4,
    error,
}: TextAreaProps) {
    return (
        <div>
            {label && <label className="field-label">{label}</label>}
            <textarea
                className="text-input textarea"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
            />
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

