import PropTypes from 'prop-types';
import { Grid, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const DateSearcher = ({ dueDate, handleDateChange }) => (
  <Grid item xs={2.5} className="inputProvider">
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        sx={{ width: '100%' }}
        value={dueDate}
        onChange={handleDateChange}
        minDate={dayjs()} // Deshabilitar días pasados
        renderInput={(params) => (
          <TextField
            {...params}
          />
        )}
      />
    </LocalizationProvider>
  </Grid>
);

DateSearcher.propTypes = {
  dueDate: PropTypes.object.isRequired,
  handleDateChange: PropTypes.func.isRequired,
};

export default DateSearcher;
