import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DateInput({ label, name, value, setData, }) {

    const dateValue = value ? dayjs(value) : null;

    return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        {...(label && { label: label })}
        format="DD/MM/YYYY"
        value={dateValue}
        onChange={(newValue) => setData((prev) => ({ ...prev, [name]: newValue?.format('DD/MM/YYYY') }))}
        />
    </LocalizationProvider>
  );
}