import Picker from 'react-mobile-picker';
import { useState, useEffect } from 'react';

interface PersonPickerProps {
    initial?: number;
    max?: number;
    onChange?: (value: number) => void;
}

export default function PersonPicker({ initial = 2, max = 20, onChange }: PersonPickerProps) {
    const [value, setValue] = useState({ persons: String(initial) });

    useEffect(() => {
        onChange?.(initial);
    }, [initial, onChange]);

    const persons = Array.from({ length: max }, (_, i) => String(i + 1));

    const handleChange = (newValue: { persons: string }) => {
        setValue(newValue);
        onChange?.(Number(newValue.persons));
    };

    return (
        <div className="person-picker">
            <Picker value={value} onChange={handleChange} wheelMode="natural" height={180}>
                <Picker.Column name="persons">
                    {persons.map((p) => (
                        <Picker.Item key={p} value={p}>
                            {p} {Number(p) > 1 ? 'pers.' : 'pers.'}
                        </Picker.Item>
                    ))}
                </Picker.Column>
            </Picker>
        </div>
    );
}
