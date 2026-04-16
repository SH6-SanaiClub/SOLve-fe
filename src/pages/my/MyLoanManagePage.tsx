import { Navigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../../constants/routePaths'

export const MyLoanManagePage = () => {
  return <Navigate replace to={ROUTE_PATHS.myFinance} state={{ initialTab: 'loan' }} />
}
