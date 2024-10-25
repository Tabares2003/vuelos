// src/components/AirportAutocomplete.jsx
import React, { useState, useEffect } from 'react';
import { Autocomplete, InputAdornment } from '@mui/material';
import { BiLoaderAlt } from 'react-icons/bi';
import { GiAirplaneArrival } from 'react-icons/gi';
import InputMui from '../MuiCustomized/InputMui'; // Asegúrate de tener este componente
import axios from 'axios';

const AirportAutocomplete = ({ placeholder, onAirportChange }) => {
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (inputValue.length >= 3) {
                setLoading(true);
                const params = { code: inputValue };

                try {
                    const res = await axios({
                        method: 'post',
                        url: 'https://staging.travelflight.aiop.com.co/api/airports/v2',
                        params: params,
                    });

                    if (res.data && res.data.airports && res.data.airports.length > 0) {
                        setOptions(res.data.airports.map((airport) => ({
                            label: `${airport.nameAirport} - ${airport.nameCountry}`,
                            data: airport,
                        })));
                    } else {
                        setOptions([{ label: 'No hay resultados', data: null }]);
                    }
                } catch (error) {
                    console.error("Error al buscar aeropuertos", error);
                    setOptions([{ label: 'Error al buscar aeropuertos', data: null }]);
                } finally {
                    setLoading(false);
                }
            } else {
                setOptions([]);
            }
        };

        fetchData();
    }, [inputValue]);

    return (
        <Autocomplete
            freeSolo
            options={options}
            getOptionLabel={(option) => option.label}
            inputValue={inputValue}
            onInputChange={(event, newValue) => {
                setInputValue(newValue);
                onAirportChange(null);
            }}
            onChange={(event, newValue) => {
                onAirportChange(newValue ? newValue.data : null);
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
                    placeholder={placeholder}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {params.InputProps.endAdornment}
                                <InputAdornment position="end">
                                    <span className={loading ? 'loadingFly' : 'flyOrigin'}>
                                        {loading ? <BiLoaderAlt /> : <GiAirplaneArrival />}
                                    </span>
                                </InputAdornment>
                            </>
                        ),
                    }}
                />
            )}
        />
    );
};

export default AirportAutocomplete;
