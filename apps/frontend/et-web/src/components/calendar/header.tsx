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
        <div className="flex justify-center items-center">
            <CaretLeftIcon size={24} className="cursor-pointer" onClick={props?.onPrevMonthClick}/>
            <p className="text-[18px]!">{MONTHS[date.getMonth()]} {date.getFullYear()}</p>
            <CaretRightIcon size={24} className="cursor-pointer" onClick={props?.onNextMonthClick}></CaretRightIcon>
        </div>
    );
}

export default CalendarHeader;