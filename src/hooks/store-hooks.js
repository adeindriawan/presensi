import { useSelector } from 'react-redux'

export const useSession = () => {
  const session = useSelector(state => state.session)
  return session
}

