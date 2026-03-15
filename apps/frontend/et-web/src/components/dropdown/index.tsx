import { useEffect } from "react";
import "./dropdown.css";

interface DropdownProps {
    options: string[];
    header: () => React.ReactNode;
    toggleId: string;
    onSelect: (option: string) => void;
}

export const Dropdown = ({ options, header, toggleId, onSelect }: DropdownProps) => {

    const handleClick = (e: any) => {
        const target = (e.target as HTMLElement).closest(`[data-toggle-id="${toggleId}"]`)?.getAttribute("data-toggle-id");
        if (target) {
            const dropdownMenu = document.getElementById(target);
            if (dropdownMenu) {
                dropdownMenu.hidden = !dropdownMenu.hidden;
            }
        } else {
            const dropdownMenu = document.getElementById(toggleId);
            if (dropdownMenu) {
                dropdownMenu.hidden = true;
            }
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        };   
    })

    return (
        <div className="dropdown">
            <button className={"dropdown-toggle"} data-toggle-id={toggleId}>
                {header()}
            </button>
            <div className="dropdown-menu" id={toggleId} hidden>
                {options.map((option) => (
                    <a key={option} className="option" href="#" onClick={(e) => {
                        e.preventDefault();
                        onSelect(option);
                    }}>
                        {option}
                    </a>
                ))}
            </div>
        </div>
    )
}