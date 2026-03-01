type DialogFooterProps = {
    onClose: () => void;
};

function DialogFooter(props: DialogFooterProps) {
    return (
        <div className="dialog-footer">
            <button type="button" className="dialog-footer-button" onClick={props.onClose}>
                Close
            </button>
        </div>
    );
}

export default DialogFooter;
