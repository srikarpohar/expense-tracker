import { CountryCode } from 'libphonenumber-js';
import countries from './countries.json';

export type Country = {
    code: string;
    name: string;
    phoneCode: string;
    currency: string;
    currencySymbol: string;
    icon: string;
};

/**
 * Get full country list
 */
export const getCountries = (): Country[] => {
    return countries as Country[];
};

/**
 * Check if country code exists
 */
export const isValidCountry = (code: CountryCode): boolean => {
    return countries.some((c: any) => c.code === code);
}

/**
 * Get country metadata by ISO code
 */
export const getCountryByCode = (code: string): Country | undefined => {
    return countries.find((c: any) => c.code === code);
}