import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { IoIosSearch } from 'react-icons/io';
import axios from 'axios';

const CreateSearch = ({
  selectedAirport,
  selectedAirportDestination,
  customDate,
  setOpenDialogAlert,
  setLoadingSearch,
  setNoResults,
  totalPassengers,
  adults,
  children,
  infants,
  babiesWithChair,
  setFlightResults,
  handleCleanSearch,
  flightResults, 
}) => {

  const handleSearch = async () => {
    // Verificamos si los aeropuertos seleccionados y la fecha están presentes
    if (!selectedAirport || !selectedAirportDestination || !customDate) {
      setOpenDialogAlert(true); // Mostramos un diálogo de alerta si faltan datos
      return;
    }

    setLoadingSearch(true);  // Iniciamos el estado de carga
    setNoResults(false); // Reiniciamos el estado de no resultados

    // Definimos el payload de la petición con los datos necesarios
    const payload = {
      direct: false, // Si el vuelo es directo o no
      currency: "COP", // Moneda en la que se realizará la búsqueda
      searchs: 50, // Número máximo de resultados de búsqueda
      class: false, // Clase del vuelo
      qtyPassengers: totalPassengers, // Cantidad total de pasajeros
      adult: adults, // Número de adultos
      child: children, // Número de niños
      baby: infants, // Número de bebés
      seat: babiesWithChair, // Bebés con silla
      itinerary: [
        {
          departureCity: selectedAirport?.codeIataAirport, // Ciudad de salida
          arrivalCity: selectedAirportDestination?.codeIataAirport, // Ciudad de llegada
          hour: customDate.toISOString() // Fecha y hora del vuelo en formato ISO
        }
      ]
    };

    console.log("Datos a enviar: ", payload); // Mostramos el payload en la consola

    try {
      // Realizamos la petición POST a la API con el payload definido
      const res = await axios({
        method: 'post',
        url: 'https://staging.travelflight.aiop.com.co/api/flights/v2',
        data: payload,
      });

      // Obtenemos los resultados de la respuesta
      const results = res.data.data.Seg1 || [];
      setFlightResults(results); // Actualizamos el estado con los resultados

      // Si no hay resultados, establecemos el estado de no resultados a verdadero
      if (results.length === 0) {
        setNoResults(true);
      }
    } catch (error) {
      // Manejamos cualquier error durante la petición
      console.error("Error fetching flights:", error);
      setFlightResults([]); // Limpiamos los resultados de vuelos
      setNoResults(true); // Establecemos el estado de no resultados a verdadero
    } finally {
      setLoadingSearch(false);  // Terminamos el estado de carga
    }
  };

  return (
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
  );
};

CreateSearch.propTypes = {
  selectedAirport: PropTypes.object,
  selectedAirportDestination: PropTypes.object,
  customDate: PropTypes.object.isRequired,
  setOpenDialogAlert: PropTypes.func.isRequired,
  setLoadingSearch: PropTypes.func.isRequired,
  setNoResults: PropTypes.func.isRequired,
  totalPassengers: PropTypes.number.isRequired,
  adults: PropTypes.number.isRequired,
  children: PropTypes.number.isRequired,
  infants: PropTypes.number.isRequired,
  babiesWithChair: PropTypes.number.isRequired,
  setFlightResults: PropTypes.func.isRequired,
  handleCleanSearch: PropTypes.func.isRequired,
  flightResults: PropTypes.array.isRequired, 
};

export default CreateSearch;
