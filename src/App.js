import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import LoadingAnimation from 'ui-component/LoadingAnimations';
import { useEffect, useState } from 'react';
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
