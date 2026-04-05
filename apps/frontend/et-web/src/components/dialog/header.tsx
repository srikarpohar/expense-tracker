import { XIcon } from "@phosphor-icons/react";

type DialogHeaderProps = {
    title: string;
    onClose?: () => void;
};

function DialogHeader(props: DialogHeaderProps) {
    return (
        <div className="l-flex l-flex--center l-dialog__header c-dialog__header">
            <h2 className="l-header__title t4">{props.title}</h2>

            <button type="button" className="o-button--icon" onClick={props.onClose} aria-label="Close dialog">
                <XIcon size={18} weight="bold" />
            </button>
        </div>
    );
}

export default DialogHeader;
