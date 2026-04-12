import { ICurrency } from "src/types";
import countries from "../intl-tel-number/countries.json";

export const getCurrencyFromCountryCode = (countryCode: string): ICurrency | null => {
    const currencyDoc = countries.find((country: any) => country.code == countryCode);
    if(!currencyDoc) {
        return null;
    }

    return currencyDoc;
}

export const getCountryCodeFromCurrencySymbol = (currencySymbol: string): string | null => {
    const currencyDoc = countries.find((country: any) => country.currencySymbol == currencySymbol);
    if(!currencyDoc) {
        return null;
    }

    return currencyDoc?.code;
}

export const formatCurrencyValue = (value: string, selectedCountryCode: string | null): string => {
    const entries = value.split(" | ").map((currencyValue) => currencyValue.trim()).filter(Boolean);
    if (!entries.length) {
        return "";
    }

    let result = [];
    for(let entry of entries) {
        const [, amount] = entry.match(/^([A-Z]{2})(\d+(?:\.\d+)?)$/)?.slice(1) ?? [];
        const countryCode = entry.slice(0, 2);

        if(selectedCountryCode && selectedCountryCode != countryCode) {
            continue;
        }

        const currencySymbol = getCurrencyFromCountryCode(countryCode)?.currencySymbol ?? countryCode;
        result.push(`${currencySymbol}${amount}`);
    }

    return result.join(" | ");
}
