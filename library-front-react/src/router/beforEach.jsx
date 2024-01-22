import { useSelector } from 'react-redux'
import { Navigate } from "react-router-dom";

const BeforeEach = (props) => {
    const isLogin = useSelector((state) => state.user.isLogin)

    return (isLogin ? <props.render />: <Navigate to='/login' />)
}

export default BeforeEach