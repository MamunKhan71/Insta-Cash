import React, { useContext, useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { FaArrowRight } from 'react-icons/fa';
import { toast, Toaster } from 'sonner';
import { AuthContext } from '../../../provider/AuthProvider';
import axios from 'axios';
export default function SendMoney() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const { user } = useContext(AuthContext)
    const [amount, setAmount] = useState(0);
    const watchedAmount = watch("amount");
    useEffect(() => {
        const numericAmount = Number(watchedAmount);
        if (numericAmount > 100) {
            setAmount(numericAmount + 5);
        } else {
            setAmount(numericAmount);
        }
    }, [watchedAmount])

    const handleForm = data => {
        const { phone, pin } = data;
        const sendMoneyInfo = {
            receiverInfo: {
                phone
            },
            senderInfo: {
                email: user?.email,
                password: pin
            },
            amount: Number(amount),
        }

        axios.post('http://localhost:5000/send-money', sendMoneyInfo)
            .then((res) => toast.success(res.data.message))
            .catch((error) => toast.error(error.response.data.message))
    }
    return (
        <div>
            <div className="w-full lg:max-w-[600px] mx-auto px-4 lg:px-0 mt-12 ">
                <div className="flex items-center justify-center h-auto lg:h-[calc(100dvh-90px)] ">
                    <div className="flex flex-col items-center font-poppins w-full border p-12 shadow-lg">
                        <div className="space-y-7 flex items-center flex-col w-full">
                            <h1 className="text-primary text-3xl font-semibold">Send Money</h1>
                            <p className="text-primary text-center text-sm">Send Money to other InstaCash user</p>
                            <form onSubmit={handleSubmit(handleForm)} className="space-y-4 w-full">
                                <div className=" mb-8 flex flex-col gap-4">
                                    <div className="w-full">
                                        <input {...register('phone')} type="text" placeholder="Phone Number" className="input bg-[#F5F9FE] w-full p-7 rounded-none" />
                                    </div>
                                    <div className="w-full space-y-2">
                                        <label className="input flex items-center gap-2 bg-[#F5F9FE] p-7 rounded-none">
                                            <input {...register('amount')} type='number' className="grow w-full" placeholder="Amount" />
                                        </label>
                                    </div>
                                    <hr />
                                    <div className='flex justify-between font-bold'>
                                        <p>Total</p>
                                        <p>{amount > 100 ? amount : amount} Tk</p>
                                    </div>
                                    {amount < 50 && <p className='text-red-400 text-xs text-right font-medium'>Amount must be more than 50 Tk *</p>}
                                    {amount > 100 && <p className='text-red-400 text-xs text-right font-medium'>Amount more than 100 tk requires 5 tk transection fee *</p>}
                                </div>
                                <div className="w-full">
                                    <button onClick={() => document.getElementById('my_modal_1').showModal()} disabled={amount >= 50 ? false : true} type="button" class="relative inline-flex items-center justify-center w-full px-12 py-3 overflow-hidden text-lg font-medium text-primary border-2 border-primary hover:text-white group hover:bg-gray-50">
                                        <span class="absolute left-0 block w-full h-0 transition-all bg-primary opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
                                        <span class="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </span>
                                        <span class="relative">Send Money</span>
                                    </button>
                                    <dialog id="my_modal_1" className="modal">
                                        <div className="modal-box rounded-none">
                                            <div className='space-y-4'>
                                                <h3 className="font-bold text-lg text-center">Enter Your Pin Code</h3>
                                                <hr />
                                                <div className="w-full space-y-2">
                                                    <label className="input flex items-center gap-2 bg-[#F5F9FE] p-7 rounded-none">
                                                        <input {...register('pin')} type='number' className="grow w-full" placeholder="5 digit Pin Code" />
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="modal-action">
                                                <button type='submit' className="btn rounded-none">Send Money</button>
                                                <form method="dialog">
                                                    <button className="btn rounded-none">Cancel</button>
                                                </form>
                                            </div>
                                        </div>
                                    </dialog>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Toaster />
            </div>
        </div>
    )
}
