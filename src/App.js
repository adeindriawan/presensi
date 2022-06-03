import { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import LoadingAnimation from 'ui-component/LoadingAnimation';
import { store, StateProvider } from 'context';

// ==============================|| APP ||============================== //

const App = () => {
    const [loading, setLoading] = useState(false);
    const customization = useSelector((state) => state.customization);
    // const isAppLoading = useSelector((state) => state.customization.app.isLoading);
    const globalState = useContext(store);

    useEffect(() => {
        if (globalState.isLoading) {
            console.log(globalState);
            setLoading(true);
        } else {
            console.log(globalState);
            setLoading(false);
        }
        // console.log(globalState);
    }, [globalState]);

    return (
        <>
            <StateProvider>
                {loading && <LoadingAnimation />}
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={themes(customization)}>
                        <CssBaseline />
                        <NavigationScroll>
                            <Routes />
                        </NavigationScroll>
                    </ThemeProvider>
                </StyledEngineProvider>
            </StateProvider>
        </>
    );
};

export default App;
