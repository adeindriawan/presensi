import { useSession } from "@/hooks/store-hooks";
import axios from "axios";

export function useApiServer() {
  const session = useSession()
  const serverApi = axios.create({
    headers: {
      'Authorization': `Bearer ${session.accessToken}`
    }
  })
  return serverApi
}