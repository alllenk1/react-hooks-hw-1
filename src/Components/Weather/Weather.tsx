import React, {useState, useEffect } from 'react';
import type { FC } from 'react';

import { cnWeather } from './Weather.classname';
import { WeatherData, WeatherProps } from "../../types";

import './Weather.css';

const Weather: FC<WeatherProps> = ({ city, onError}) => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)

    useEffect(() => {
        if (city) {
            fetch(`https://api.weatherapi.com/v1/current.json?key=67d78e8460e64321bf4194540242903&q=${city}`)
                .then(response => response.json())
                .then(data => setWeatherData({
                    temp_c: data.current.temp_c,
                    conditionText: data.current.condition.text,
                    conditionIcon: data.current.condition.icon,
                }))
                .catch(() => onError(true))
        }
    }, [city]);

    return (
        weatherData ?
            (
                <div className={cnWeather()}>
                    <div className={cnWeather('Left-Column')}>
                        <h1 className={cnWeather('City')}>{city}</h1>
                        <p className={cnWeather('Temp')}>{`${weatherData?.temp_c}℃`}</p>
                    </div>
                    <div className={cnWeather('Right-Column')}>
                        <img className={cnWeather('Icon')} src={weatherData?.conditionIcon} alt="Иконка погоды"/>
                        <p className={cnWeather('Description')}>{weatherData?.conditionText}</p>
                    </div>
                </div>
            ) : (
                <div className={cnWeather()}>
                    <p className={cnWeather('Loading')}>Checking the weather...</p>
                </div>
            )
    )
}

export {Weather};
