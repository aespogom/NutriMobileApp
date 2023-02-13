import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
export default function Users() {
    const [data, setData] = useState([])
    const [mode, setMode] = useState('online');
    useEffect(() => {
        let url = "https://jsonplaceholder.typicode.com/users"
        fetch(url).then((response) => {
            response.json().then((result) => {
                console.warn(result)
                setData(result)
                localStorage.setItem("users", JSON.stringify(result)) // store data for offline usage 
            })
        }).catch(err => {
            setMode('offline')
            let collection = localStorage.getItem('users'); // get data from cache in offline modus
            setData(JSON.parse(collection))
        })
    }, [])
    return (
        <div>
            <div>
                {
                    mode === 'offline' ?
                        <div className="alert alert-warning" role="alert">
                            you are in offline mode or some issue with connection
</div>
                        : null

                }
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item) => (
                            <tr>
                                <td key="id">{item.id}</td>
                                <td key="name">{item.name}</td>
                                <td key="email">{item.email}</td>
                                <td key="address">{item.address.street}</td>
                            </tr>
                        ))
                    }

                </tbody>
            </Table>
        </div>
    )
}