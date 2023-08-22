import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { useEffect, useState } from 'react';

import LoadingAnimation from '@/ui-component/LoadingAnimations';
// project imports
import NavigationScroll from '@/layout/NavigationScroll';
// routing
import Routes from '@/routes';
import { ThemeProvider } from '@mui/material/styles';
// defaultTheme
import themes from '@/themes';
import { useSelector } from 'react-redux';

// ==============================|| APP ||============================== //

const App = () => {
    const session = useSelector((state) => state.customization);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(session.app.isLoading);
    }, [session.app.isLoading]);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(session)}>
                {isLoading ? <LoadingAnimation /> : ''}
                <CssBaseline />
                <NavigationScroll>
                    <Routes />
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
