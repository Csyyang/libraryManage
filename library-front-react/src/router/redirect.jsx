import { useSelector } from 'react-redux'
import { Navigate } from "react-router-dom";

const Redirect = () => {
    const isAdmin = useSelector((state) => state.user.isAdmin)

    return (isAdmin ?<Navigate to='/examine/borrowed' />: <Navigate to='/book/bookList' />)
}

export default Redirect