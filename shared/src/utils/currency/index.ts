import { ICurrency } from "src/types";
import countries from "../intl-tel-number/countries.json";

export const getCurrencyFromCountryCode = (currencyCode: string): ICurrency | null => {
    const currencyDoc = countries.find((country: any) => country.currency == currencyCode);
    if(!currencyDoc) {
        return null;
    }

    return currencyDoc;
}

export const getCountryCodeFromCurrency = (currencySymbol: string): string | null => {
    const currencyDoc = countries.find((country: any) => country.currencySymbol == currencySymbol);
    if(!currencyDoc) {
        return null;
    }

    return currencyDoc?.code;
}

export const getCurrencySymbolFromCurrency = (currency: string): string | null => {
    const currencyDoc = countries.find((country: any) => country.currency == currency);
    if(!currencyDoc) {
        return null;
    }

    return currencyDoc?.currencySymbol;
}

export const formatCurrencyValue = (value: string): string => {
    const entries = value.split(" | ").map((currencyValue) => currencyValue.trim()).filter(Boolean);
    if (!entries.length) {
        return "";
    }

    let result = [];
    for(let entry of entries) {
        const [, amount] = entry.match(/^([A-Z]{3})(\d+(?:\.\d+)?)$/)?.slice(1) ?? [];
        console.log("Amount:", amount);
        const currencyCode = entry.slice(0, 3);

        const currencySymbol = getCurrencySymbolFromCurrency(currencyCode);
        result.push(`${currencySymbol ?? currencyCode}${amount}`);
    }

    return result.join(" | ");
}
