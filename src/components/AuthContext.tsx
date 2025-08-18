// Temporary placeholder - authentication will be added later
export const AuthContext = null
export const AuthProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const useAuth = () => ({ user: null, loading: false })