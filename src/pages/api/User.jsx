// User.jsx
import React, { useState, useEffect } from 'react';

const User = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('/api/users')
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error('Error fetching users:', error));
    }, []);

    return (
        <div className="container">
            <h1 className="text-xl font-bold">Users List</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id} className="my-2">
                        {user.name} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default User;
