type DialogFooterProps = {
    children?: React.ReactNode;
    onClose: () => void;
};

function DialogFooter(props: DialogFooterProps) {
    return (
        <div className="l-flex l-flex--end l-dialog__footer">
            {props.children}

            {!props.children && (
                <button type="button" className="o-button" onClick={props.onClose}>
                    Close
                </button>
            )}
        </div>
    );
}

export default DialogFooter;
