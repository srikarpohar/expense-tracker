import { XIcon } from "@phosphor-icons/react";

type DialogHeaderProps = {
    title: string;
    onClose?: () => void;
};

function DialogHeader(props: DialogHeaderProps) {
    return (
        <div className="dialog-header">
            <h2 className="dialog-title">{props.title}</h2>

            <button type="button" className="cursor-pointer" onClick={props.onClose} aria-label="Close dialog">
                <XIcon size={18} weight="bold" />
            </button>
        </div>
    );
}

export default DialogHeader;
