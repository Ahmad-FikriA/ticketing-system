import { useNavigate } from "react-router";

const ForbiddenPage = () => {
    const navigate = useNavigate();
    return (
        <section className="grid place-items-center w-screen min-h-screen font-primary bg-primary-bg">
            <div className="max-w-4xl w-full mx-auto flex justify-center items-center flex-col gap-4 text-center">
                <div className="text-6xl font-bold text-red-500">403</div>
                <h1 className="text-xl sm:text-3xl font-bold text-primary-text">
                    Access Denied
                </h1>
                <p className="text-secondary-text">
                    You don't have permission to access this page.
                </p>
                <button 
                    onClick={() => navigate("/login")}
                    className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-black/80 transition"
                >
                    Go to Login
                </button>
            </div>
        </section>
    );
};

export default ForbiddenPage;
