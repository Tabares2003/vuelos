import { Grid, InputAdornment } from '@mui/material';
import { BiLoaderAlt } from 'react-icons/bi';
import { GiAirplaneArrival } from 'react-icons/gi';
import CustomAutocomplete from '../MuiCustomized/CustomAutocomplete';
import InputMui from '../MuiCustomized/InputMui';

const DestinationSearcher = ({
    optionsDestination,
    inputValueDestination,
    setInputValueDestination,
    loadingDestination,
    setLoadingDestination,
    selectedAirportDestination,
    setSelectedAirportDestination
}) => {

    return (
        <Grid item xs={2.5}>
            <CustomAutocomplete
                freeSolo
                options={optionsDestination}
                getOptionLabel={(option) => option.label}
                inputValue={inputValueDestination}
                onInputChange={(event, newValue) => {
                    setInputValueDestination(newValue);
                    setSelectedAirportDestination(null);
                }}
                onChange={(event, newValue) => {
                    setSelectedAirportDestination(newValue ? newValue.data : null);
                    console.log("Aeropuerto de destino seleccionado:", newValue ? newValue.data : null);
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
                        placeholder="Destination"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {params.InputProps.endAdornment}
                                    <InputAdornment position="end">
                                        <span className={loadingDestination ? 'loadingFly' : 'flyOrigin'}>
                                            {loadingDestination ? <BiLoaderAlt /> : <GiAirplaneArrival />}
                                        </span>
                                    </InputAdornment>
                                </>
                            ),
                        }}
                    />
                )}
            />
            {optionsDestination.length === 1 && optionsDestination[0].label === 'Not found' && !selectedAirportDestination && (
                <div className='divNotFound'>
                    <p>No airports found!</p>
                </div>
            )}
        </Grid>
    );
};

export default DestinationSearcher;
