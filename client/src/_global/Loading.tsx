import { ImSpinner8 } from "react-icons/im"

const Loading = () => {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <i className="animate-spin">
                <ImSpinner8 size={50} />
            </i>
        </div>
    )
}

export default Loading