import countries from "../intl-tel-number/countries.json";

export const getCurrencyFromCode = (currencyCode: string): {currency: string, currencySymbol: string} | null => {
    const currencyDoc = countries.find(country => country.currency == currencyCode);
    if(!currencyDoc) {
        return null;
    }

    return {
        currency: currencyDoc?.currency,
        currencySymbol: currencyDoc?.currencySymbol
    }
}