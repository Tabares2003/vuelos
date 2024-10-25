import PropTypes from 'prop-types';
import { GiAirplaneDeparture, GiAirplaneArrival } from 'react-icons/gi';

const FlightResults = ({
  flightResults,
  currentItems,
  itemsPerPage,
  currentPage,
  handlePageChange,
}) => (
  <>
    {flightResults.length > 0 && (
      <div className='mainFlightsFound'>
        <div className='topMainFlightsFound'>
          <p>We have found these flights for you!</p>
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
                    <span>{segment.productDateTime.dayDeparture}</span>
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
                    <span>{segment.productDateTime.dayArrival}</span>
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
  </>
);

FlightResults.propTypes = {
  flightResults: PropTypes.array.isRequired,
  currentItems: PropTypes.array.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
};

export default FlightResults;
