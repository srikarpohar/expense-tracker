import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import DialogFooter from "./footer";
import DialogHeader from "./header";
import './dialog.css';

export type DialogRef = {
    open: () => void;
    close: () => void;
};

type DialogProps = {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

function Dialog(props: DialogProps, ref: React.Ref<DialogRef>) {
    const [visible, setVisible] = useState(props.isOpen);

    useEffect(() => {
        setVisible(props.isOpen);
    }, [props.isOpen]);

    const handleClose = () => {
        setVisible(false);
        props.onClose();
    };

    useImperativeHandle(ref, () => ({
        open: () => setVisible(true),
        close: handleClose,
    }));

    if (!visible) {
        return null;
    }

    return (
        <div className="dialog-container">
            <div className="dialog-content">
                <DialogHeader title={props.title} onClose={handleClose} />
                {props.children}
                <DialogFooter onClose={handleClose} />
            </div>
        </div>
    );
}

export default forwardRef(Dialog);
