import { Navigate, useLocation } from "react-router-dom"

const PrivateRoute = ( props ) => {
  const { children } = props
  const isLoggedIn = localStorage.getItem('userEmail') !== null;
  const location = useLocation()

  return isLoggedIn ? (
    <>{children}</>
  ) : (
    <Navigate
      replace={true}
      to="/"
      state={{ from: `${location.pathname}${location.search}` }}
    />
  )
}

export default PrivateRoute;