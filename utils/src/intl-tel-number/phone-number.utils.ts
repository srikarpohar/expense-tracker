import { getCountryByCode, isValidCountry } from "./countries";
import parsePhoneNumber, { type CountryCode} from 'libphonenumber-js/mobile';

/**
 * Validate and normalize phone number using country code
 *
 * @param phone - user entered phone number (without country code or with)
 * @param countryCode - ISO-3166-1 alpha-2 (e.g. IN, US)
 *
 * @returns normalized E.164 phone number (e.g. +919876543210)
 * @throws Error if invalid
 */
export const isValidPhoneNumber = (phoneNumber: string, countryCode: CountryCode) => {
    const country = getCountryByCode(countryCode);
    if(!country) {
        throw new Error("Invalid Country code given");
    }

    const parsedPhoneNumber = parsePhoneNumber(`${country.phoneCode}${phoneNumber}`, {
        defaultCountry: countryCode
    });

    if(!parsedPhoneNumber || !parsedPhoneNumber.country) {
        throw new Error("Invalid phone number and country code");
    }
    if (!parsedPhoneNumber.isValid()) {
        throw new Error('Invalid phone number format for the country code given');
    }

    return true;
}

/*
  format phone number in default extension format along with country code.
*/
export const formatPhoneNumber = (phoneNumber: string, countryCode: CountryCode): string => {
    try {
        const parsedPhoneNumber = parsePhoneNumber(phoneNumber, {
            defaultCountry: countryCode
        });

        return parsedPhoneNumber?.format("E.164") ?? "";
    } catch {
        return "";
    } finally {
        return "";
    }
}