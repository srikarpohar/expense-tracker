import { useRef, useState } from "react";
import AccordionHeader, { type AccordionHeaderRef } from "./header";
import AccordionItem from "./item";

export type AccordionData = {
    id: string;
    title: string;
    items: {
        id: string;
        title: string;
    }[]
}

type AccordionProps = {
    data: AccordionData[];
    openAtStart?: boolean;
    headerComponent?: React.ReactNode;
    itemComponent?: React.ReactNode;
    onHeaderClick?: (header: Omit<AccordionData, 'items'>) => void;
    onItemClick?: (item: Pick<AccordionData, 'items'>, headerId: string) => void;
    children?: React.ReactNode;
}

function Accordion(props: AccordionProps) {
    const [openHeaders, setOpenHeaders] = useState<Set<string>>(() => {
        const initialOpenHeaders = new Set<string>();
        if(props.openAtStart) {
            for(let row of props.data) {
                initialOpenHeaders.add(row.id);
            }
        }
        return initialOpenHeaders;
    });
    const refs = useRef<Array<AccordionHeaderRef | null>>(new Array(props.data.length).fill(null));

    const addRef = (el: AccordionHeaderRef | null, index: number) => {
        if (el && !refs.current[index]) {
            refs.current[index] = el;
        }
    }

    const toggleHeader = (id: string) => {
        const newOpenHeaders = new Set(openHeaders);
        if (newOpenHeaders.has(id)) {
            newOpenHeaders.delete(id);
        } else {
            newOpenHeaders.add(id);
        }

        setOpenHeaders(newOpenHeaders);
    };

    return (
        <ul className="w-full h-full">
            {props.data.map(((row, index) => (
                <li key={row.id} className="mb-2 bg-gray-200 rounded-xl">
                    <AccordionHeader ref={(el) => addRef(el, index)}
                        title={row.title}
                        isOpen={openHeaders.has(row.id)}
                        toggleHeader={() => toggleHeader(row.id)}>
                        {props.headerComponent}
                    </AccordionHeader>
                    
                    <ul className={`ml-3 list-header ${openHeaders.has(row.id) ? 'list-expand-animation' : 'list-collapse-animation'}`}>
                        {row.items.map(item => (
                            <li key={`${row.id}-${item.id}`} className="mb-1">
                                <AccordionItem title={item.title}>
                                    {props.itemComponent}
                                </AccordionItem>
                            </li>
                        ))}
                    </ul>
                </li>
            )))}
        </ul>
    );
}

export default Accordion;