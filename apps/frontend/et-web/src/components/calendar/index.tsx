import { getDaysInMonth } from 'expense-tracker-utils';
import * as React from 'react';
import "./calendar.module.css";
import CalendarCell from './cell';

export const MONTHS = [
    "January", 
    "February", 
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export const WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thurshday", "Friday", "Saturday"];

type ICalendarProps = {
    date: Date,
    type: "month";
    renderCell?: (date: Date) => React.ReactNode;
}

type DateCell = {
    date: Date;
    isDateInCurrMonth?: boolean;
}

function Calendar(props: ICalendarProps) {

    const { date } = props;
    // fetch no of rows and cols from the given date.
    const daysInMonth = getDaysInMonth(props.date);

    const cols = 7;
    const rows = Math.ceil((daysInMonth / cols));

    const data: DateCell[][] = new Array(rows);

    // get first day of month.
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let startDayOfFirstWeek = firstDayOfMonth.getDay();
    let dayCounter = startDayOfFirstWeek * -1;

    for(let row=0;row < rows;row++) {
        let week = new Array(cols);
        for(let col = 0; col < cols;col++) {
            let currDayNo = 0;
            if(dayCounter < 0) {
                // previous month date.
                currDayNo = dayCounter + daysInMonth;
            } else if(dayCounter < daysInMonth) {
                // current month date.
                currDayNo = dayCounter + 1;
            } else {
                // next month date.
                currDayNo = dayCounter - daysInMonth + 1;
            }
            
            const isDateInCurrMonth = dayCounter >=0 && dayCounter < daysInMonth;
            const currDate = isDateInCurrMonth ? 
                new Date(date.getFullYear(), date.getMonth(), currDayNo) : 
                new Date(date.getFullYear(), date.getMonth() + (dayCounter < 0 ? -1 : 1), currDayNo);
            week.push({
                date: currDate,
                isDateInCurrMonth: dayCounter >=0 && dayCounter < daysInMonth
            })
            
            dayCounter++;
        }

        data[row] = week;
    }
    
    // TODO: Convert cell into seperate component.
    return (
      <div className="calendar_l-calendar calendar_c-calendar"
        style={{"--tw-calendar-rows": `repeat(${rows}, minmax(0, 1fr))`} as React.CSSProperties}>
        <div className='calendar_l-row' key="calendar-header">
            {WEEK.map((week, index) => (
                <CalendarCell day={week.substring(0, 3)} isHeader key={"week0day" + index}>
                </CalendarCell>
            ))}
        </div>

        {data.map((row, wkIndex) => {
          return (
            <div className='calendar_l-row' key={`week-${wkIndex + 1}`}>
                {row.map((col, dayIndex) => (
                    <CalendarCell date={col.date} key={`week-${wkIndex + 1}_day-${dayIndex}`} >
                        {props.renderCell && props.renderCell(col.date)}
                    </CalendarCell>
                ))}
            </div>
          );
        })}
      </div>
    );
}

export default Calendar; 