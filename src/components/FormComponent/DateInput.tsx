import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface Props {
    label?: string;
    value: string;
    name: string;
    setData: React.Dispatch<React.SetStateAction<any>>;
}

export default function DateInput({ label, name, value, setData, }: Props) {

    const dateValue = value ? dayjs(value) : null;

    console.log(dateValue);

    return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        {...(label && { label: label })}
        format="DD/MM/YYYY"
        value={dateValue}
        onChange={(newValue) => setData((prev: any) => ({ ...prev, [name]: newValue?.format('DD/MM/YYYY') }))}
        />
    </LocalizationProvider>
  );
}