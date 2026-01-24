import { getDaysInMonth } from 'expense-tracker-shared';
import * as React from 'react';
import "./calendar.css";
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
    children?: React.ReactNode;
}

type DateCell = {
    date: number;
    isDateInMonth?: boolean;
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

            week.push({
                date: currDayNo,
                isDateInMonth: dayCounter >=0 && dayCounter < daysInMonth
            })
            
            dayCounter++;
        }

        data[row] = week;
    }
    
    // TODO: Convert cell into seperate component.
    return (
      <div className={`calendar-row grid-rows-[50px] auto-rows-fr rounded-xl w-full h-full`}>
        {WEEK.map((week, index) => (
        <div className='row-start-1 date-container p-2 flex justify-center items-center' key={"week0day" + index}>
            <CalendarCell date={week.substring(0, 3)} isHeader>
                {props.children}
            </CalendarCell>
        </div>
        ))}

        {data.map((row, wkIndex) => {
          return (
              row.map((col, dayIndex) => (
                <div key={`week-${wkIndex + 1}_day-${dayIndex}`} 
                    className={`row-start-${wkIndex + 2} date-container p-2`}>
                    <CalendarCell date={col.date.toString()}>
                        {props.children}
                    </CalendarCell>
                </div>
              ))
          );
        })}
      </div>
    );
}

export default Calendar; 