// context/UserContext.js
'use client';
import { createContext, useEffect, useState, useContext } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { data: session } = useSession();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (session?.user?.email) {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/save`, {
          name: session.user.name,
          email: session.user.email,
          photo: session.user.image,
        });

        setRole(res.data.user.role); // role from backend
      }
    };

    fetchRole();
  }, [session]);

  return (
    <UserContext.Provider value={{ role }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
