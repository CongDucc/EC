import React, { createContext, useState, ReactNode } from "react";

interface IgetUserId {
    getUserId: string | null;
    setGetUserId: (getUserId: string) => void;
}

const defaultValue: IgetUserId = {
    getUserId: "",
    setGetUserId: () => { },
};

const UserType = createContext(defaultValue);
const UserContext = ({ children }: { children: ReactNode }) => {
    const [getUserId, setGetUserId] = useState<string | null>("");

    return (
        <UserType.Provider value={{ getUserId, setGetUserId }}>
            {children}
        </UserType.Provider>
    );
};

export { UserType, UserContext };
