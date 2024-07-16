import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import axios from "axios";
const Register = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { createUser } = useContext(AuthContext)
    const [passStatus, setPassStatus] = useState(false)
    const [logStatus, setLogStatus] = useState('')
    const handleForm = async (data) => {
        const { name, pin: password, phone, email, accType } = data
        const newUser = {
            name,
            email,
            password,
            phone,
            accType,
            status: "pending",
            balance: 0,
        }
        console.log(newUser);
        axios.post("http://localhost:5000/register", newUser)
            .then(res => {
                createUser(email, res.data.password)
                    .then(() => console.log("User created successfully!"))
                    .catch(() => console.log("Something went wrong"))
            })
            .catch(error => console.log(error))
    }

    return (
        <div className="w-full lg:max-w-[600px] mx-auto px-4 lg:px-0 mt-12 ">
            <div className="flex items-center justify-center h-auto lg:h-[calc(100dvh-90px)] ">
                <div className="flex flex-col items-center font-poppins w-full border p-12 shadow-lg">
                    <div className="space-y-7 flex items-center flex-col w-full">
                        <h1 className="text-primary text-3xl font-semibold">Register</h1>
                        <p className="text-primary text-center text-sm">Register yourself to get access to InstaCash</p>
                        <form onSubmit={handleSubmit(handleForm)} className="space-y-4 w-full">
                            <div className=" mb-8 flex flex-col gap-4">
                                <div className="w-full">
                                    <input {...register('name')} type="text" placeholder="Your name here" className="input bg-[#F5F9FE] w-full p-7 rounded-none" />
                                </div>
                                {/* <div className="w-full space-y-2">
                                    <label className="input flex items-center gap-2 bg-[#F5F9FE] p-7 rounded-none">
                                        <input {...register('pin')}
                                            placeholder="Your 5 digit pin here"
                                            maxLength="5"
                                            pattern="\d{5}"
                                            title="Please enter exactly 5 digits" type={passStatus ? "text" : "password"} className="grow w-full"/>
                                        {
                                            passStatus ? <FaRegEye className="text-2xl hover:cursor-pointer" onClick={() => setPassStatus(!passStatus)} /> : <FaRegEyeSlash className="text-2xl hover:cursor-pointer" onClick={() => setPassStatus(!passStatus)} />
                                        }
                                    </label>
                                </div> */}
                                <div className="w-full">
                                    <input
                                        {...register('pin')}
                                        type="password"
                                        placeholder="Your 5 digit pin here"
                                        className="input bg-[#F5F9FE] w-full p-7 rounded-none"
                                        maxLength="5"
                                        pattern="\d{5}"
                                        title="Please enter exactly 5 digits"
                                    />
                                </div>
                                <div className="w-full">
                                    <input {...register('phone')} type="text" placeholder="Your phone number here" className="input bg-[#F5F9FE] w-full p-7 rounded-none" />
                                </div>
                                <div className="w-full">
                                    <input {...register('email')} type="email" placeholder="Your email here" className="input bg-[#F5F9FE] w-full p-7 rounded-none" />
                                </div>
                                <select {...register('accType')} className="select bg-[#F5F9FE] w-full rounded-none text-primary">
                                    <option disabled selected className="text-primary">Select account type</option>
                                    <option value={'agent'}>Agent</option>
                                    <option value={'user'}>User</option>
                                </select>
                            </div>
                            <div className="w-full">
                                <button type="submit" class="relative inline-flex items-center justify-center w-full px-12 py-3 overflow-hidden text-lg font-medium text-primary border-2 border-primary hover:text-white group hover:bg-gray-50">
                                    <span class="absolute left-0 block w-full h-0 transition-all bg-primary opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                                    <span class="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </span>
                                    <span class="relative">Register</span>
                                </button>
                            </div>
                            <p className="text-sm">Don’t have account? <Link to="/login" className="text-[#3461FD]">Login</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;