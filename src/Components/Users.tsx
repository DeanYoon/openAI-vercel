import { useState } from "react";
import { IUserData } from "./KakaoLogin";

const Users = () => {
  const [users, setUsers] = useState<IUserData[]>();
  return (
    <div>
      <h2>Users List</h2>
      {users?.length ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>{user.nickname}</li>
          ))}
        </ul>
      ) : (
        <p>No users</p>
      )}
    </div>
  );
};

export default Users;
