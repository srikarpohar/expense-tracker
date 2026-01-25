import { CaretDownIcon } from "@phosphor-icons/react";
import { forwardRef, useImperativeHandle, useState } from "react";

export type AccordionHeaderRef = {
    toggle: () => void;
}

type AccordionHeaderProps = {
    id: string;
    title: string;
    openOnMount?: boolean;
    children?: React.ReactNode;
    toggleHeader?: () => void;
}

function AccordionHeader(props: AccordionHeaderProps, ref: React.Ref<AccordionHeaderRef>) {
    const [isOpen, setIsOpen] = useState(props.openOnMount || false);

    useImperativeHandle(ref, () => ({
        toggle: toggle
    }));

    const toggle = () => {
        setIsOpen(!isOpen);
        props.toggleHeader && props.toggleHeader();
    }

    return (
        <div className='p-1 cursor-pointer flex items-center gap-2 sticky top-0 bg-gray-200 rounded-xl' onClick={toggle}>
            <CaretDownIcon size={16} weight="bold" className={isOpen ? "header-icon-rotate-back-animation" : "header-icon-rotate-animation"}/> 
            {!props.children && <p className='text-[18px]! font-bold text-gray-800'>
                {props.title}
            </p>}

            {props.children && props.children}
        </div>
    );
}

export default forwardRef(AccordionHeader);