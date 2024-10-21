import { useNavigate } from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate()

    return (
        <button
            onClick={() => navigate(-1)}
            className="flex items-center bg-blue-600 text-white font-medium py-1 px-3 mb-2 rounded-lg shadow hover:bg-blue-500 transition duration-200"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12H3m0 0l6-6m-6 6l6 6"
                />
            </svg>
            Back
        </button>
    );
};

export default BackButton;