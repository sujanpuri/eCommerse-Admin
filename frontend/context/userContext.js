'use client';
import { createContext, useEffect, useState, useContext } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (session?.user?.email) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/save`,
            {
              name: session.user.name,
              email: session.user.email,
              photo: session.user.image,
            }
          );
          setUser(res.data.user); // Save full user
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      }
    };

    fetchUser();
  }, [session]);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
