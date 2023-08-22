import loading from '@/assets/images/loading.gif';
import { styled } from '@mui/material/styles';

const LoadingAnimation = styled('div')({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
    width: '100%',
    height: '100%',
    background: `black url(${loading}) center center no-repeat`,
    opacity: 0.5
});

export default LoadingAnimation;
