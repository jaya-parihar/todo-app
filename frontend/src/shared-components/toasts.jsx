import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";

function Toasts({ showToast, setShowToast, message }) {

    return (
        <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
            <Toast onClose={() => setShowToast(false)} show={showToast} delay={2000} autohide>
                <Toast.Header>
                    <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                    />
                    <strong className="me-auto">Todo</strong>
                    <small>Just Now</small>
                </Toast.Header>
                <Toast.Body>{message}</Toast.Body>
            </Toast>
        </ToastContainer>

    )
}

export default Toasts