
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
import OriginSearcher from './SearcherComponents/OriginSearcher';
import FlightResults from './SearcherComponents/FlightResults';
import DestinationSearcher from './SearcherComponents/DestinationSearcher';
import PassengerSelector from './SearcherComponents/PassengerSelector';

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

    const [noResults, setNoResults] = useState(false);

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
        setNoResults(false); // Reiniciar el estado de no resultados

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

            const results = res.data.data.Seg1 || [];
            setFlightResults(results);

            if (results.length === 0) {
                setNoResults(true);
            }

        } catch (error) {
            console.error("Error fetching flights:", error);
            setFlightResults([]);
            setNoResults(true);
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

                                    <OriginSearcher
                                        options={options}
                                        inputValue={inputValue}
                                        setInputValue={setInputValue}
                                        setSelectedAirport={setSelectedAirport}
                                        selectedAirport={selectedAirport}
                                        loading={loading}
                                    />

                                    <DestinationSearcher
                                        optionsDestination={optionsDestination}
                                        inputValueDestination={inputValueDestination}
                                        setInputValueDestination={setInputValueDestination}
                                        loadingDestination={loadingDestination}
                                        setLoadingDestination={setLoadingDestination}
                                        selectedAirportDestination={selectedAirportDestination}
                                        setSelectedAirportDestination={setSelectedAirportDestination}
                                    />


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

                                    <PassengerSelector
                                        totalPassengers={totalPassengers}
                                        handleClick={handleClick}
                                        id={id}
                                        open={open}
                                        anchorEl={anchorEl}
                                        handleClose={handleClose}
                                        passengers={passengers}
                                        decrement={decrement}
                                        increment={increment}
                                    />

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

                        {noResults && (
                            <div className='noResults'>
                                <p>No flights found!</p>
                            </div>
                        )}

                        <FlightResults
                            flightResults={flightResults}
                            currentItems={currentItems}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            handlePageChange={handlePageChange}
                        />
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