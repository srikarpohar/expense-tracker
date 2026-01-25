type AccordionItemProps = {
    id: string;
    title: string;
    children?: React.ReactNode;
}

function AccordionItem(props: AccordionItemProps) {
    return (
        <div className="text-gray-800">
            {!props.children && <p className="text-[14px]!">{props.title}</p>}
            {props.children && props.children}
        </div>
    );
}

export default AccordionItem;