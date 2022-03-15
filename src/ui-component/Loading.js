import loading from 'assets/images/loading.gif';
import { styled } from '@mui/material/styles';

const Overlay = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    background: '#808080'
});

const OverlayWrapper = styled('div')({
    width: '100%',
    height: '100%',
    position: 'relative'
});

const OverlaySpinner = styled('div')({
    position: 'absolute',
    left: '50%',
    top: '50%'
    // transform: translate('-50%', '-50%')
});

const Loading = () => (
    <Overlay>
        <OverlayWrapper>
            <OverlaySpinner>
                <img src={loading} alt="loading..." />
            </OverlaySpinner>
        </OverlayWrapper>
    </Overlay>
);

export default Loading;
