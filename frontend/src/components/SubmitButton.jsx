import { Link } from "react-router-dom";

export const SubmitButton = ({ text, to }) => {
    return (
        <button type={to ? "button" : "submit"} 
        className="form-submit-container form-input-1 py-3 px-6 text-3xl mb-6 self-center w-auto"
        >
            {to ? <Link to={to}>{text}</Link> : text }
        </button>
    );
};