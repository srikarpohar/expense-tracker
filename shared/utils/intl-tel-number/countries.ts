import { CountryCode } from 'libphonenumber-js';
import countries from './countries.json';

export type Country = typeof countries[number];

/**
 * Get full country list
 */
export const getCountries = () => {
    return countries;
};

/**
 * Check if country code exists
 */
export const isValidCountry = (code: CountryCode): boolean => {
    return countries.some(c => c.code === code);
}

/**
 * Get country metadata by ISO code
 */
export const getCountryByCode = (code: string): Country | undefined => {
    return countries.find(c => c.code === code);
}