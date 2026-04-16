import { useLocation, useNavigate } from 'react-router-dom'

const useReturnNavigation = (fallbackPath: string) => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const returnTo = (state as { returnTo?: string } | null)?.returnTo

  const goBack = () => {
    navigate(returnTo ?? fallbackPath, { replace: true })
  }

  return { goBack }
}

export default useReturnNavigation
