import { useSelector } from 'react-redux'
import { Navigate } from "react-router-dom";

const Redirect = () => {
    const isAdmin = useSelector((state) => state.user.isAdmin)
    console.log(isAdmin)
    return (JSON.parse(isAdmin) ? <Navigate to='/examine/borrowed' /> : <Navigate to='/book/bookList' />)
}

export default Redirect