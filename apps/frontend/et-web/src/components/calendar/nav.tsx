import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { MONTHS } from ".";
import "./calendar.module.css";

type ICalendarNavProps = {
    date: Date,
    onPrevMonthClick?: () => void,
    onNextMonthClick?: () => void,
}

function CalendarNav(props: ICalendarNavProps) {
    const { date } = props;

    return (
        <div className="calendar_l-nav calendar_c-nav">
            <CaretLeftIcon size={18} weight="bold" onClick={props?.onPrevMonthClick}/>
            <p className="t4">{MONTHS[date.getMonth()]} {date.getFullYear()}</p>
            <CaretRightIcon size={18} weight="bold" onClick={props?.onNextMonthClick}></CaretRightIcon>
        </div>
    );
}

export default CalendarNav;