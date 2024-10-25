import PropTypes from 'prop-types';
import { Grid, InputAdornment } from '@mui/material';
import { BiLoaderAlt } from 'react-icons/bi';
import { GiAirplaneDeparture } from 'react-icons/gi';
import CustomAutocomplete from '../MuiCustomized/CustomAutocomplete';
import InputMui from '../MuiCustomized/InputMui';

const OriginSearcher = ({
  options,
  inputValue,
  setInputValue,
  setSelectedAirport,
  selectedAirport,
  loading,
}) => (
  <Grid item xs={2.5}>
    <CustomAutocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => option.label}
      inputValue={inputValue}
      onInputChange={(event, newValue) => {
        setInputValue(newValue);
        setSelectedAirport && setSelectedAirport(null);
      }}
      onChange={(event, newValue) => {
        setSelectedAirport && setSelectedAirport(newValue ? newValue.data : null);
        console.log("Aeropuerto seleccionado:", newValue ? newValue.data : null);
      }}
      renderOption={(props, option) => (
        <li {...props} className="autocomplete-option">
          {option.label}
        </li>
      )}
      ListboxProps={{ className: 'autocomplete-options' }}
      renderInput={(params) => (
        <InputMui
          {...params}
          placeholder="Origin"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {params.InputProps.endAdornment}
                <InputAdornment position="end">
                  <span className={loading ? 'loadingFly' : 'flyOrigin'}>
                    {loading ? <BiLoaderAlt /> : <GiAirplaneDeparture />}
                  </span>
                </InputAdornment>
              </>
            ),
          }}
        />
      )}
    />
    {options.length === 1 && options[0].label === 'Not found' && !selectedAirport && (
      <div className="divNotFound">
        <p>No airports found!</p>
      </div>
    )}
  </Grid>
);

OriginSearcher.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
  })).isRequired,
  inputValue: PropTypes.string.isRequired,
  setInputValue: PropTypes.func.isRequired,
  setSelectedAirport: PropTypes.func.isRequired,
  selectedAirport: PropTypes.object,
  loading: PropTypes.bool.isRequired,
};

export default OriginSearcher;
