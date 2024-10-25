
import { CircularProgress, Grid } from '@mui/material';
import { BsAirplaneEngines } from 'react-icons/bs';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import AlertDialog from './MuiCustomized/AlertDialog';
import OriginSearcher from './SearcherComponents/OriginSearcher';
import FlightResults from './SearcherComponents/FlightResults';
import DestinationSearcher from './SearcherComponents/DestinationSearcher';
import PassengerSelector from './SearcherComponents/PassengerSelector';
import CreateSearch from './SearcherComponents/CreateSearch';

const Searcher = () => {

    //estados origen
    const [options, setOptions] = useState([]); //estado que almacena las opciones de los aeropueros de orgien
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedAirport, setSelectedAirport] = useState(null);


    //estados destino
    const [optionsDestination, setOptionsDestination] = useState([]); //estado que almacena las opciones de los aeropueros de destino
    const [inputValueDestination, setInputValueDestination] = useState('');
    const [loadingDestination, setLoadingDestination] = useState(false);
    const [selectedAirportDestination, setSelectedAirportDestination] = useState(null);

    //estado para limpiar los input del autocomplete
    const [clearInputs, setClearInputs] = useState(false);

    //estado para almacenar la fecha
    const [customDate, setCustomDate] = useState(dayjs());

    //estados para almacenar los pasageros
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [babiesWithChair, setBabiesWithChair] = useState(0);

    //suma de todos los pasajeros
    const totalPassengers = adults + children + infants + babiesWithChair;

    //estados que abren el popover
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [loadingSearch, setLoadingSearch] = useState(false);
    const [flightResults, setFlightResults] = useState([]);

    //estados que controlan la paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = flightResults.slice(indexOfFirstItem, indexOfLastItem);

    //estado de alerta de formulario
    const [openDialogAlert, setOpenDialogAlert] = useState(false);

    //estado que controla si viene o no resultados en la busqueda
    const [noResults, setNoResults] = useState(false);

    const passengers = [
        { title: "Adults", description: "Adults 12 years of age or older.", count: adults, setCount: setAdults },
        { title: "Children", description: "2 to 11 Years.", count: children, setCount: setChildren },
        { title: "Babies", description: "0 to 23 Months.", count: infants, setCount: setInfants },
        { title: "Babies with chair", description: "0 to 23 Months.", count: babiesWithChair, setCount: setBabiesWithChair }
    ];

    //función que permite incrementar algún pasajero ya sea adulto etc
    const increment = (setter, value) => () => setter(value + 1);

    //función que permite restar los pasajeros
    const decrement = (setter, value) => () => {
        if (value > 0) setter(value - 1);
    };

    //función que abre alerta de formulario
    const handleCloseDialogAlert = () => {
        setOpenDialogAlert(false);
    };

    //función que abre popover
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    //función que cierra popover
    const handleClose = () => {
        setAnchorEl(null);
    };

    //función que obtiene la fecha y la formatea
    const handleDateChange = (newDate) => {
        setCustomDate(newDate);
        const formattedDate = newDate.toISOString();
        console.log("Hour:", formattedDate);
    };

    //función que permite limpiar  y  reiniciar los campos
    const handleCleanSearch = () => {
        setFlightResults([]);
        setOptions([]); // Reiniciar las opciones para Origin
        setOptionsDestination([]);
        setCustomDate(dayjs());
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

    //función que permite moverse en la paginación con el efecto
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        // Definimos una función asíncrona para realizar la petición de datos
        const fetchData = async () => {
            // Verificamos si el input tiene al menos 3 caracteres y clearInputs es falso
            if (inputValue.length >= 3 && !clearInputs) {
                // Establecemos el estado de carga a verdadero
                setLoading(true);

                // Definimos los parámetros de la petición
                const params = {
                    code: inputValue
                };

                try {
                    // Realizamos la petición POST a la API con los parámetros definidos
                    const res = await axios({
                        method: 'post',
                        url: 'https://staging.travelflight.aiop.com.co/api/airports/v2',
                        params: params,
                    });

                    // Mostramos la respuesta en la consola
                    console.log("Respuesta actualización item pedido: ", res);

                    // Si la respuesta contiene aeropuertos, actualizamos el estado de opciones
                    if (res.data && res.data.airports && res.data.airports.length > 0) {
                        setOptions(res.data.airports.map((airport) => ({
                            label: `${airport.nameAirport} - ${airport.nameCountry}`,
                            data: airport,
                        })));
                    } else {
                        // Si no hay aeropuertos, establecemos una opción de 'Not found'
                        setOptions([{ label: 'Not found', data: null }]);
                    }
                } catch (error) {
                    // Manejamos cualquier error durante la petición
                    console.error("Error al crear ítem de factura (endPoint 344)", error);
                    setOptions([{ label: 'Error al buscar aeropuertos', data: null }]);
                } finally {
                    // Establecemos el estado de carga a falso
                    setLoading(false);
                }
            } else {
                // Si el input tiene menos de 3 caracteres, vaciamos las opciones
                setOptions([]);
            }
        };

        // Verificamos si clearInputs es falso y llamamos a fetchData
        if (!clearInputs) {
            fetchData();
        } else {
            // Si clearInputs es verdadero, vaciamos las opciones y restablecemos clearInputs a falso
            setOptions([]);
            setClearInputs(false);
        }
    }, [inputValue, clearInputs]);




    useEffect(() => {
        // Definimos una función asíncrona para realizar la petición de datos
        const fetchData = async () => {
            // Verificamos si el input tiene al menos 3 caracteres y clearInputs es falso
            if (inputValueDestination.length >= 3 && !clearInputs) {
                // Establecemos el estado de carga a verdadero
                setLoadingDestination(true);

                // Definimos los parámetros de la petición
                const params = {
                    code: inputValueDestination
                };

                try {
                    // Realizamos la petición POST a la API con los parámetros definidos
                    const res = await axios({
                        method: 'post',
                        url: 'https://staging.travelflight.aiop.com.co/api/airports/v2',
                        params: params,
                    });

                    // Mostramos la respuesta en la consola
                    console.log("Respuesta actualización item pedido: ", res);

                    // Si la respuesta contiene aeropuertos, actualizamos el estado de opciones
                    if (res.data && res.data.airports && res.data.airports.length > 0) {
                        setOptionsDestination(res.data.airports.map((airport) => ({
                            label: `${airport.nameAirport} - ${airport.nameCountry}`,
                            data: airport,
                        })));
                    } else {
                        // Si no hay aeropuertos, establecemos una opción de 'Not found'
                        setOptionsDestination([{ label: 'Not found', data: null }]);
                    }
                } catch (error) {
                    // Manejamos cualquier error durante la petición
                    console.error("Error al crear ítem de factura (endPoint 344)", error);
                    setOptionsDestination([{ label: 'Error al buscar aeropuertos', data: null }]);
                } finally {
                    // Establecemos el estado de carga a falso
                    setLoadingDestination(false);
                }
            } else {
                // Si el input tiene menos de 3 caracteres, vaciamos las opciones
                setOptionsDestination([]);
            }
        };

        // Verificamos si clearInputs es falso y llamamos a fetchData
        if (!clearInputs) {
            fetchData();
        } else {
            // Si clearInputs es verdadero, vaciamos las opciones y restablecemos clearInputs a falso
            setOptionsDestination([]);
            setClearInputs(false);
        }
    }, [inputValueDestination, clearInputs]);

    return (
        <>
            <div className={flightResults.length > 0 ? 'mainDiv2' : 'mainDiv'}>
                <video autoPlay muted loop className="bg-video">
                    <source src="../../public/vuelo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

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
                                                value={customDate}
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

                                    <CreateSearch
                                        selectedAirport={selectedAirport}
                                        selectedAirportDestination={selectedAirportDestination}
                                        customDate={customDate}
                                        setOpenDialogAlert={setOpenDialogAlert}
                                        setLoadingSearch={setLoadingSearch}
                                        setNoResults={setNoResults}
                                        totalPassengers={totalPassengers}
                                        adults={adults}
                                        children={children}
                                        infants={infants}
                                        babiesWithChair={babiesWithChair}
                                        setFlightResults={setFlightResults}
                                        handleCleanSearch={handleCleanSearch}
                                        flightResults={flightResults}
                                    />
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