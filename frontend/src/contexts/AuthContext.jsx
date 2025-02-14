import { createContext, useContext, useState, useEffect } from 'react';

// 개발용 임시 사용자 데이터
const DEFAULT_USER = {
    employeeId: "1234567",
    name: "김동우",
    position: "ROLE_MANAGER", // ROLE_MEMBER
    token: "dummy-token"
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : DEFAULT_USER; // 개발 중에는 기본값 사용
    });

    useEffect(() => {
        // 로컬 스토리지에서 사용자 정보 복구
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('todayWorks');
        localStorage.removeItem('selectedWorks');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};