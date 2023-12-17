import "./Overlay.css";
import { ReactNode } from "react";

interface OverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

function Overlay(props: OverlayProps): JSX.Element {
    return (
        <>
            {props.isOpen && (
                <div className="overlay">
                    <div className="overlay__background" onClick={props.onClose} />
                    <div className="overlay__container">{props.children}</div>
                </div>
            )}
        </>
    );
}

export default Overlay;
