import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Transactions() {
    const [users, setUsers] = useState([])
    useEffect(() => {
        axios.get('http://localhost:5000/transactions')
            .then((response) => setUsers(response.data))
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
                        users?.map(user => (
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
                                            <div className="font-bold">{user?.name}</div>
                                            <div className="text-sm opacity-50">{user?.accType}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {user?.email}
                                    <br />
                                    <span className="badge badge-ghost badge-sm">{user?.phone}</span>
                                </td>
                                <td>{user?.status}</td>
                                <td>{user?.balance}</td>
                                {/* <th>
                                    {user?.status === "pending" ? <button onClick={() => handleApprove(user?._id)} className="btn btn-xs">Approve</button> : <button className="btn btn-xs disabled:text-white disabled:bg-green-600" disabled>Approved</button>}
                                </th> */}
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
