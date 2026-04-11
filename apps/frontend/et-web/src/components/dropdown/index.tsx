import { useEffect } from "react";
// import "./dropdown.css";

interface DropdownProps {
    options: string[];
    toggle: () => React.ReactNode;
    header?: () => React.ReactNode;
    toggleId: string;
    onSelect: (option: string) => void;
}

export const Dropdown = ({ options, toggle, header, toggleId, onSelect }: DropdownProps) => {

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
        <div className="o-dropdown">
            <button className="o-dropdown__toggle--icon" data-toggle-id={toggleId}>
                {toggle()}
            </button>
            <div className="o-dropdown__menu" id={toggleId} hidden>
                {header && <div className="o-dropdown__header">{header()}</div>}
                {options.map((option) => (
                    <a key={option} className="o-menu-item" href="#" onClick={(e) => {
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