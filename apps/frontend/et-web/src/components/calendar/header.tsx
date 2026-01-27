import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { MONTHS } from ".";

type ICalendarHeaderProps = {
    date: Date,
    onPrevMonthClick?: () => void,
    onNextMonthClick?: () => void,
}

function CalendarHeader(props: ICalendarHeaderProps) {
    const { date } = props;

    return (
        <div className="flex justify-center items-center gap-2">
            <CaretLeftIcon size={24} weight="bold" className="calendar-nav" onClick={props?.onPrevMonthClick}/>
            <CaretRightIcon size={24} weight="bold" className="calendar-nav" onClick={props?.onNextMonthClick}></CaretRightIcon>
            <p className="text-[18px]!">{MONTHS[date.getMonth()]} {date.getFullYear()}</p>
        </div>
    );
}

export default CalendarHeader;