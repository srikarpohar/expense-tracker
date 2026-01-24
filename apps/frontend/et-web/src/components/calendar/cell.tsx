import "./index.css";

type ICalendarCellProps = {
    date: string,
    children?: React.ReactNode,
    isHeader?: boolean,
}

function CalendarCell(props: ICalendarCellProps) {
    return (
        <div className={`cell ${props.isHeader ? '' : 'h-full'}`}>
            <p className={`text-center ${props.isHeader ? 'font-bold' : ''}`}>
                {props.date}
            </p>

            {
                !props.isHeader && props.children
            }
        </div>
    );
}

export default CalendarCell;