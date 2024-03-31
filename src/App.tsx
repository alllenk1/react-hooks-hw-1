import React, { useEffect, useState } from 'react';
import { Button, CircularProgress } from "@mui/material";

import { cnApp } from './App.classname';
import { Weather } from './Components/Weather/Weather';
import { CityChecker } from './Components/CityChecker/CityChecker';
import { Position } from './types';

import './App.css';

const App = () => {
    const [basicCity, setBasicCity] = useState<Position | undefined>(undefined)
    const [selectedCity, setSelectedCity] = useState(localStorage.getItem('selectedCity') || '');
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);

    console.log('isLoading', isLoading)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition( (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            fetch(`https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location=${latitude}%2C${longitude}&language=en`, {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '92931cace2msh4af96698850720dp11ae5djsn83ef9959081a',
                    'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
                }
            })
                .then(response => response.json())
                .then(data => setBasicCity({
                    name: data.results[0].locality,
                    latitude,
                    longitude
                }))
                .catch(() => setError(true))
                .finally(() => setLoading(false))
        });
    }, []);

    const handleChangeCity = (newCity: string) => {
        setSelectedCity(newCity);
        localStorage.setItem('selectedCity', newCity);
    };

    const handleGetUserPosition = () => {
        if (basicCity) setSelectedCity(basicCity.name);
        localStorage.removeItem('selectedCity');
    };

    const handleSetError = (boolean: boolean) => {
        setError(boolean);
    }

    return (
        <div className={cnApp()}>
            {
                isLoading
                    ? ( <CircularProgress /> )
                    : (
                        isError
                            ? (<p className={cnApp('Error')}>Something wrong ¯\_(ツ)_/¯</p>)
                            : (
                                <>
                                    <Weather
                                        city={selectedCity ? selectedCity : basicCity?.name}
                                        onError={handleSetError}
                                    />
                                    <div className={cnApp('CityChecker-Group')}>
                                        <CityChecker
                                            className={cnApp('CityChecker')}
                                            onSubmit={handleChangeCity}
                                            onError={handleSetError}
                                        />
                                        <Button
                                            className={cnApp('Button')}
                                            variant="outlined"
                                            onClick={handleGetUserPosition}
                                        >
                                            My geo
                                        </Button>
                                    </div>
                                </>
                            )
                    )
            }
        </div>
    );
}

export default App;
