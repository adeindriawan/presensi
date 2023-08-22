import { SESSION_LOGOUT, WORK_STARTED } from '@/store/actions';

import { Navigate } from 'react-router-dom';
import config from '@/config';
import { useApiServer } from '@/utils/useApiServer';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useSession } from '@/hooks/store-hooks';

const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    const session = useSession()
    const apiServer = useApiServer()
    const isTokenValid = session?.tokenExpireAt && new Date().getTime() + 10000 < new Date(session.tokenExpireAt).getTime();

    if (!isTokenValid) {
        dispatch({
            type: SESSION_LOGOUT
        });
        return <Navigate to="/login" replace={true} />;
    }

    useEffect(() => {
        apiServer.get(`${config.baseUrl}/work/user/check`).then((res) => {
            const workToday = res.data.data;
            if (workToday !== null && Object.keys(workToday).length > 0) {
                const venue = workToday.venue;
                dispatch({ type: WORK_STARTED, payload: venue });
            }
        });
    }, []);

    return children;
};

export default ProtectedRoute;
