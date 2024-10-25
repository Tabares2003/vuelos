
import { CircularProgress, Grid, InputAdornment, Popover } from '@mui/material';
import { BsAirplaneEngines } from 'react-icons/bs';
import InputMui from './MuiCustomized/InputMui';
import CustomAutocomplete from './MuiCustomized/CustomAutocomplete';
import { GiAirplaneArrival, GiAirplaneDeparture } from 'react-icons/gi';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import TextField from '@mui/material/TextField';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LuUsers2 } from 'react-icons/lu';
import { IoIosAddCircleOutline, IoIosSearch } from 'react-icons/io';
import { GrSubtractCircle } from 'react-icons/gr';
import AlertDialog from './MuiCustomized/AlertDialog';

const Searcher = () => {

    //estados origen
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedAirport, setSelectedAirport] = useState(null);


    //estados destino
    const [optionsDestination, setOptionsDestination] = useState([]);
    const [inputValueDestination, setInputValueDestination] = useState('');
    const [loadingDestination, setLoadingDestination] = useState(false);
    const [selectedAirportDestination, setSelectedAirportDestination] = useState(null);

    const [clearInputs, setClearInputs] = useState(false);


    const [dueDate, setDueDate] = useState(dayjs());

    const [anchorEl, setAnchorEl] = useState(null);

    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [babiesWithChair, setBabiesWithChair] = useState(0);

    const totalPassengers = adults + children + infants + babiesWithChair;

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [loadingSearch, setLoadingSearch] = useState(false);
    const [flightResults, setFlightResults] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = flightResults.slice(indexOfFirstItem, indexOfLastItem);

    const [openDialogAlert, setOpenDialogAlert] = useState(false);


    const passengers = [
        { title: "Adults", description: "Adults 12 years of age or older.", count: adults, setCount: setAdults },
        { title: "Children", description: "2 to 11 Years.", count: children, setCount: setChildren },
        { title: "Babies", description: "0 to 23 Months.", count: infants, setCount: setInfants },
        { title: "Babies with chair", description: "0 to 23 Months.", count: babiesWithChair, setCount: setBabiesWithChair }
    ];

    const increment = (setter, value) => () => setter(value + 1);

    const decrement = (setter, value) => () => {
        if (value > 0) setter(value - 1);
    };

    const handleCloseDialogAlert = () => {
        setOpenDialogAlert(false);
    };


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDateChange = (newDate) => {
        setDueDate(newDate);
        const formattedDate = newDate.toISOString();
        console.log("Hour:", formattedDate);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (inputValue.length >= 3 && !clearInputs) {
                setLoading(true);
                const params = {
                    code: inputValue,
                };
                try {
                    const res = await axios({
                        method: 'post',
                        url: 'https://staging.travelflight.aiop.com.co/api/airports/v2',
                        params: params,
                    });
                    console.log("Respuesta actualización item pedido: ", res);
                    if (res.data && res.data.airports && res.data.airports.length > 0) {
                        setOptions(res.data.airports.map((airport) => ({
                            label: `${airport.nameAirport} - ${airport.nameCountry}`,
                            data: airport,
                        })));
                    } else {
                        setOptions([{ label: 'Not found', data: null }]);
                    }
                } catch (error) {
                    console.error("Error al crear ítem de factura (endPoint 344)", error);
                    setOptions([{ label: 'Error al buscar aeropuertos', data: null }]);
                } finally {
                    setLoading(false);
                }
            } else {
                setOptions([]);
            }
        };

        if (!clearInputs) {
            fetchData();
        } else {
            setOptions([]);
            setClearInputs(false);
        }
    }, [inputValue, clearInputs]);



    useEffect(() => {
        const fetchData = async () => {
            if (inputValueDestination.length >= 3 && !clearInputs) {
                setLoadingDestination(true);
                const params = {
                    code: inputValueDestination,
                };
                try {
                    const res = await axios({
                        method: 'post',
                        url: 'https://staging.travelflight.aiop.com.co/api/airports/v2',
                        params: params,
                    });
                    console.log("Respuesta actualización item pedido: ", res);
                    if (res.data && res.data.airports && res.data.airports.length > 0) {
                        setOptionsDestination(res.data.airports.map((airport) => ({
                            label: `${airport.nameAirport} - ${airport.nameCountry}`,
                            data: airport,
                        })));
                    } else {
                        setOptionsDestination([{ label: 'Not found', data: null }]);
                    }
                } catch (error) {
                    console.error("Error al crear ítem de factura (endPoint 344)", error);
                    setOptionsDestination([{ label: 'Error al buscar aeropuertos', data: null }]);
                } finally {
                    setLoadingDestination(false);
                }
            } else {
                setOptionsDestination([]);
            }
        };

        if (!clearInputs) {
            fetchData();
        } else {
            setOptionsDestination([]);
            setClearInputs(false);
        }
    }, [inputValueDestination, clearInputs]);


    const handleSearch = async () => {
        if (!selectedAirport || !selectedAirportDestination || !dueDate) {
            setOpenDialogAlert(true);
            return;
        }

        setLoadingSearch(true);  // Iniciar carga

        const payload = {
            direct: false,
            currency: "COP",
            searchs: 50,
            class: false,
            qtyPassengers: totalPassengers,
            adult: adults,
            child: children,
            baby: infants,
            seat: babiesWithChair,
            itinerary: [
                {
                    departureCity: selectedAirport?.codeIataAirport,
                    arrivalCity: selectedAirportDestination?.codeIataAirport,
                    hour: dueDate.toISOString()
                }
            ]
        };

        console.log("Datos a enviar: ", payload)

        try {
            const res = await axios({
                method: 'post',
                url: 'https://staging.travelflight.aiop.com.co/api/flights/v2',
                data: payload,
            });

            console.log("Search Results:", res.data.data.Seg1);
            setFlightResults(res.data.data.Seg1 || []);
        } catch (error) {
            console.error("Error fetching flights:", error);
            setFlightResults([]);
        } finally {
            setLoadingSearch(false);  // Terminar carga
        }
    };

    const handleCleanSearch = () => {
        setFlightResults([]);
        setOptions([]); // Reiniciar las opciones para Origin
        setOptionsDestination([]);
        setDueDate(dayjs());
        setAdults(1);
        setChildren(0);
        setInfants(0);
        setBabiesWithChair(0);
        setCurrentPage(1);
        setInputValue('');
        setSelectedAirport(null);
        setInputValueDestination('');
        setSelectedAirportDestination(null);
        setClearInputs(true);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <div className={flightResults.length > 0 ? 'mainDiv2' : 'mainDiv'}>
                <div className='searcherMain'>
                    <div className='whiteCard' style={{ position: 'relative' }}>
                        {loadingSearch && (
                            <div className='loadingDiv' >
                                <CircularProgress size={24} color='white' />
                                <p>Looking for the best flights for you!</p>
                            </div>
                        )}

                        <div className='topWhiteCard'>
                            <div className='titleWhiteCard'>
                                <BsAirplaneEngines />
                                <h2>Book your flight</h2>
                            </div>
                        </div>

                        <Grid container>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>

                                    <Grid item xs={2.5}>
                                        <CustomAutocomplete
                                            freeSolo
                                            options={options}
                                            getOptionLabel={(option) => option.label}
                                            inputValue={inputValue}
                                            onInputChange={(event, newValue) => {
                                                setInputValue(newValue);
                                                setSelectedAirport(null);
                                            }}
                                            onChange={(event, newValue) => {
                                                setSelectedAirport(newValue ? newValue.data : null);
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
                                                                        {loading ? <BiLoaderAlt /> : <GiAirplaneArrival />}
                                                                    </span>
                                                                </InputAdornment>
                                                            </>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                        {options.length === 1 && options[0].label === 'Not found' && !selectedAirport && (
                                            <div className='divNotFound'>
                                                <p>No airports found!</p>
                                            </div>
                                        )}
                                    </Grid>


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


                                    <Grid item xs={2.5} className='inputProvider'>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                sx={{ width: '100%' }}
                                                value={dueDate}
                                                onChange={handleDateChange}
                                                minDate={dayjs()}  // Deshabilitar días pasados
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Grid>

                                    <Grid item xs={2.5}>
                                        <div className='passengersButton' onClick={handleClick}>
                                            <p>{totalPassengers} passenger{totalPassengers !== 1 ? 's' : ''}</p>
                                            <LuUsers2 />
                                        </div>
                                        <Popover
                                            id={id}
                                            open={open}
                                            anchorEl={anchorEl}
                                            onClose={handleClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                                width: '100px'
                                            }}
                                        >
                                            <div className='divPopover'>
                                                <div className='topPopover'>
                                                    <p>PASSENGERS</p>
                                                </div>

                                                <div>
                                                    {passengers.map((passenger, index) => (
                                                        <div key={index} className='divPassengers'>
                                                            <div className='topPassengers'>
                                                                <h3>{passenger.title}</h3>
                                                                <p>{passenger.description}</p>
                                                            </div>
                                                            <div className='contentPassengers'>
                                                                <button
                                                                    className='lessButton'
                                                                    onClick={decrement(passenger.setCount, passenger.count, 1)}
                                                                    disabled={passenger.title === "Adults" && passenger.count <= 1}>
                                                                    <GrSubtractCircle />
                                                                </button>
                                                                <div>
                                                                    {passenger.count}
                                                                </div>
                                                                <button onClick={increment(passenger.setCount, passenger.count)} className='addButton'>
                                                                    <IoIosAddCircleOutline />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Popover>
                                    </Grid>

                                    <Grid item xs={2} className='searchCont'>
                                        {flightResults.length > 0 ? (
                                            <div onClick={handleCleanSearch}>
                                                <p>CLEAN</p>
                                            </div>
                                        ) : (
                                            <div onClick={handleSearch}>
                                                <IoIosSearch />
                                                <p>SEARCH</p>
                                            </div>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        {flightResults.length > 0 && (
                            <div className='mainFlightsFound'>
                                <div className='topMainFlightsFound'>
                                    <p>We have found these flights for you! </p>
                                </div>

                                {currentItems.map((flight, index) => (
                                    <div className='FlightsFound' key={index}>
                                        {flight.segments.map((segment, segIndex) => (
                                            <div key={segIndex} className='divFly'>
                                                <div className='timeDataMain'>
                                                    <div>
                                                        <img src={`https://pics.avs.io/60/60/${segment.companyId.marketingCarrier}.png`} alt={`${segment.companyId.marketingCarrier}`} />
                                                    </div>
                                                    <div className='timeData'>
                                                        <p>{segment.productDateTime.timeOfDeparture}</p>
                                                        <span>
                                                            {segment.productDateTime.dayDeparture}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='mainLocationsData'>
                                                    <div className='topLocations'>
                                                        <GiAirplaneDeparture />
                                                        <p>Direct</p>
                                                        <GiAirplaneArrival />
                                                    </div>
                                                    <div className='locationsData'>
                                                        {segment.location.map((loc, locIndex) => (
                                                            <div key={locIndex}>
                                                                <p>{loc.locationId}</p>
                                                                <p>{loc.locationName}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className='timeDataMain'>
                                                    <div className='timeData'>
                                                        <p>{segment.productDateTime.timeOfArrival}</p>
                                                        <span>
                                                            {segment.productDateTime.dayArrival}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <img src={`https://pics.avs.io/60/60/${segment.companyId.operatingCarrier}.png`} alt={`${segment.companyId.operatingCarrier} logo`} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                ))}
                                <div className='pagination'>
                                    {Array.from({ length: Math.ceil(flightResults.length / itemsPerPage) }, (_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={currentPage === i + 1 ? 'activePagination' : 'paginationButton'}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            <AlertDialog
                open={openDialogAlert}
                onClose={handleCloseDialogAlert}
                title="Action Needed"
                content="To do the search you must complete the necessary data!"
            />

        </>
    );
};

export default Searcher;