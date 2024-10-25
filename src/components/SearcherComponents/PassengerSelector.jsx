import React from 'react';
import { Grid, Popover } from '@mui/material';
import { LuUsers2 } from 'react-icons/lu';
import { GrSubtractCircle } from 'react-icons/gr';
import { IoIosAddCircleOutline } from 'react-icons/io';

const PassengerSelector = ({
    totalPassengers,
    handleClick,
    id,
    open,
    anchorEl,
    handleClose,
    passengers,
    increment,
    decrement
}) => {
    return (
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
                                        onClick={decrement(passenger.setCount, passenger.count)}
                                        disabled={passenger.title === "Adults" && passenger.count <= 1}
                                    >
                                        <GrSubtractCircle />
                                    </button>
                                    <div>{passenger.count}</div>
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
    );
};

export default PassengerSelector;
