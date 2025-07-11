import { Link } from "react-router-dom";

export const SubmitButton = ({ disabled, text, to }) => {
    return (
        <button type={to ? "button" : "submit"} disabled={disabled}
            className={`form-submit-container form-input-1 py-3 px-6 text-3xl mb-6 self-center w-auto ${disabled ? "button-disabled" : ""}`}
        >
            {to ? <Link to={to}>{text}</Link> : text}
        </button>
    );
};