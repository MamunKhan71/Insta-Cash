import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Transactions() {
    const [transactions, setTransactions] = useState([])
    useEffect(() => {
        axios.get('http://localhost:5000/transactions')
            .then((response) => setTransactions(response.data))
            .catch(error => console.log(error))
    }, [])
    const handleApprove = (id) => {
        axios.patch('http://localhost:5000/user/update', { id: id })
            .then(() => console.log(res.data))
            .catch(() => console.log(error))
    }
    // senderInfo, receiverInfo, transactionAmount, transactionType, transactionFee, transactionTime
    return (
        <div className="overflow-x-auto rounded-xl shadow">
            <table className="table">
                <thead>
                    <tr>
                        <th>Transaction Id</th>
                        <th>Sender No.</th>
                        <th>Receiver No.</th>
                        <th>Transaction Type</th>
                        <th>Transaction Amount</th>
                        <th>Transaction Fee</th>
                        <th>Trasnaction Time</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        transactions?.map(user => (
                            <tr>
                                <td>
                                    <div className="flex items-center gap-3">
                                        {/* <div className="avatar">
                                            <div className="mask mask-squircle h-12 w-12">
                                                <img
                                                    src="https://img.daisyui.com/tailwind-css-component-profile-2@56w.png"
                                                    alt="Avatar Tailwind CSS Component" />
                                            </div>
                                        </div> */}
                                        <div>
                                            <div className="font-bold">{user?.transactionId}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {user?.senderInfo}
                                </td>
                                <td>{user?.receiverInfo}</td>
                                <td>{user?.transactionType}</td>
                                <td>{user?.transactionAmount}</td>
                                <td>{user?.transactionFee}</td>
                                <td>{user?.transactionTime}</td>
                                
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
