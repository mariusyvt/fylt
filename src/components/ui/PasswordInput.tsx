"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
}

export default function PasswordInput({
    label,
    value,
    onChange,
    placeholder = "••••••••",
    error,
}: PasswordInputProps) {
    const [show, setShow] = useState(false);

    return (
        <div>
            {label && <label className="field-label">{label}</label>}
            <div className="password-wrapper">
                <input
                    type={show ? "text" : "password"}
                    className="text-input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShow((prev) => !prev)}
                >
                    {show ? <EyeOff /> : <Eye />}
                </button>
            </div>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

