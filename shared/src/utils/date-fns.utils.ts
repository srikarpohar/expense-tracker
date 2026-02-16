export const getDaysInMonth = (date: Date, month?: number) => {
    const givenMonth = month ? month : date.getMonth();

    return new Date(date.getFullYear(), givenMonth + 1, 0).getDate();
}

export const getDateFromDay = (month: number, year: number, day: number) => {
    return new Date(year, month, )
}