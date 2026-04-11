import "./calendar.module.css";

type ICalendarCellProps = {
    date?: Date,
    day?: string,
    children?: React.ReactNode,
    isHeader?: boolean,
}

function CalendarCell(props: ICalendarCellProps) {
    return (
        <div className={`calendar_l-cell calendar_c-cell ${props.isHeader ? 'calendar_c-cell--header calendar_l-cell--header' : ''}`}>
            {
                props.isHeader && <p className="s2">{props.day}</p>
            }
            {
                !props.isHeader && (
                    <div className="calendar_c-cell__date calendar_l-cell__date">
                        <p className="s2">{props.date?.getDate()}</p>
                        {props.children}
                    </div>
                )
            }
        </div>
    );
}

export default CalendarCell;