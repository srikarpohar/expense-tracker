type DialogFooterProps = {
    children?: React.ReactNode;
    onClose: () => void;
};

function DialogFooter(props: DialogFooterProps) {
    return (
        <div className="dialog-footer">
            {props.children}

            {!props.children && (
                <button type="button" className="dialog-footer-button" onClick={props.onClose}>
                    Close
                </button>
            )}
        </div>
    );
}

export default DialogFooter;
