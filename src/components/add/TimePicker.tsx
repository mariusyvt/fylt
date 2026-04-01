import Picker from 'react-mobile-picker';

interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
}

export default function TimePicker({ value, onChange }: TimePickerProps) {
    const selections = {
        hours: Array.from({ length: 24 }, (_, i) => String(i)),
        minutes: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
    };

    // Parse la string "3h20" en objet { hours: "3", minutes: "20" }
    const parseTime = (timeStr: string): { hours: string; minutes: string } => {
        const match = timeStr.match(/^(\d+)h(\d+)?$/);
        if (match) {
            return { hours: match[1], minutes: match[2] || "00" };
        }
        return { hours: "0", minutes: "00" };
    };

    const pickerValue = parseTime(value);

    const handleChange = (newValue: { hours: string; minutes: string }) => {
        const h = parseInt(newValue.hours) || 0;
        const m = newValue.minutes;
        onChange(`${h}h${m}`);
    };

    return (
        <Picker value={pickerValue} onChange={handleChange} wheelMode="natural" height={180}>
            <Picker.Column name="hours">
                {selections.hours.map((hour) => (
                    <Picker.Item key={hour} value={hour}>{hour}h</Picker.Item>
                ))}
            </Picker.Column>
            <Picker.Column name="minutes">
                {selections.minutes.map((min) => (
                    <Picker.Item key={min} value={min}>{min}min</Picker.Item>
                ))}
            </Picker.Column>
        </Picker>
    );
}
