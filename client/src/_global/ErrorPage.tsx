import { useNavigate } from "react-router";

const ErrorPage = () => {
    const navigate = useNavigate();
    return(
        <section className="grid place-items-center w-screen font-primary bg-primary-bg">
            <div className="max-w-4xl w-full mx-auto flex justify-center items-center flex-col gap-2 text-center">
                <h1 className="text-xl sm:text-4xl font-bold gap-2 flex flex-col items-center">
                    <span className="text-primary-text">
                        Seems Your Page Got Lost
                    </span>
                </h1>
                <p className="text-secondary-text">
                    Click the button below to go back to the homepage
                </p>
                <button onClick={() => navigate("/")}>
                    Go back
                </button>
            </div>
        </section>
    )
}

export default ErrorPage;