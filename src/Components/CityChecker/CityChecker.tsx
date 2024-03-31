import React, { useEffect, useState, useRef } from 'react';
import type { ChangeEvent, FC } from 'react';
import { TextField, MenuItem } from '@mui/material';

import { cnCityChecker } from './CityChecker.classname';
import type { Position, CityCheckerProps } from '../../types';

import './CityChecker.css';

const CityChecker: FC<CityCheckerProps> = ({ className, onSubmit, onError }) => {
    const [cities, setCities] = useState<Position[]>([]);
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [lastSearch, setLastSearch] = useState('');

    const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        if (loading) {
            return;
        }

        if (lastSearch === search) {
            return;
        }

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (search === '') {
            setCities([]);
            setLastSearch('');
            setLoading(false);

            return;
        }

        timerRef.current = setTimeout(() => {
            setLoading(true);

            fetch(`https://api.api-ninjas.com/v1/city?name=${search}&limit=10`, {
                method: 'GET',
                    headers: {
                    'X-Api-Key': 'm1n74jUjViEVpnrpDeGNwA==lntdcBrfhcI2p5x7',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then((citiesResponse: Position[]) => {
                    setCities(citiesResponse.filter(city => city.name.toLowerCase().startsWith(search.toLowerCase())));
                })
                .catch(() => onError(true))
                .finally(() => {
                    setLoading(false);
                    setLastSearch(search);
                })
        }, 400)
    }, [lastSearch, loading, search]);

    const handleChangeCity = (event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }

    const handleChooseCity = (event: React.MouseEvent<HTMLLIElement>) => {
        const selectedCity = event.currentTarget.textContent || '';
        setCity(event.currentTarget.textContent || '');
        setSearch(selectedCity);

        onSubmit(selectedCity);
        setCities([]);
        setSearch('');
    }

    return (
        <form className={className}>
            <TextField
                className={cnCityChecker('List')}
                onChange={handleChangeCity}
                value={search}
                label="Select city"
            />
            <div className={cnCityChecker('Result')}>
                {cities.map(city =>
                    <MenuItem
                        key={`${city.latitude}${city.longitude}`}
                        className={cnCityChecker('City')}
                        onClick={handleChooseCity}
                    >
                        {city.name}
                    </MenuItem>)}
            </div>
        </form>
    );
}

export { CityChecker };