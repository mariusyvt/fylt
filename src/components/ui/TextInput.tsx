"use client";

interface TextInputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    error?: string;
    className?: string;
}

export default function TextInput({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    error,
    className = "",
}: TextInputProps) {
    return (
        <div>
            {label && <label className="field-label">{label}</label>}
            <input
                type={type}
                className={`text-input ${className}`.trim()}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

