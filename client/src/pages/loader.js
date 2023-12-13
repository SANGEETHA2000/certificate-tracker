import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = ( {openLoader} ) => {

    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: 9999 }}
                open={openLoader}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default Loader;