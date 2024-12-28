import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import OtpInput from "react-otp-input";

const VerifyPin = () => {
    const [pin, setPin] = useState("");
    const navigate = useNavigate();
    const handlePinChange = (otp) => {
        setPin(otp);
    };
    const verifyPin = () => {
        const storedPin = localStorage.getItem("user_pin");
        if (pin === storedPin) {
            toast.success("Identity Verified!");
            navigate("/dashboard");
        } else {
            toast.error("Invalid PIN. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#25D366]">
            <div className="w-full max-w-sm p-8 bg-gradient-to-r from-[#075E54] via-[#128C7E] to-[#25D366] rounded-xl shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105">
                <h2 className="text-3xl font-extrabold text-center text-[#25D366] mb-8">Enter PIN</h2>
                <div className="mb-6">
                    <div className="flex justify-center mb-5">
                        <OtpInput
                            value={pin}
                            onChange={handlePinChange}
                            numInputs={3}
                            renderSeparator={
                                <span style={{ width: "15px" }}> </span>
                            }
                            renderInput={(props) => (
                                <input
                                    {...props}
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        border: "2px solid #128C7E",
                                        borderRadius: "10px",
                                        fontSize: "20px",
                                        textAlign: "center",
                                        transition: "border-color 0.3s ease-in-out",
                                    }}
                                    className="focus:outline-none focus:ring-2 focus:ring-[#25D366] placeholder:text-[#128C7E]"
                                    placeholder="●"
                                />
                            )}
                        />
                    </div>
                </div>
                <button
                    onClick={verifyPin}
                    className="w-full py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-[#128C7E] transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Verify PIN
                </button>
            </div>
        </div>
    );
};

export default VerifyPin;
