import { Dialog, Button } from '@mui/material';
import { IoAlertCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';

const AlertDialog = ({ open, onClose, title, content }) => {
    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { padding: "20px" } }}>
            <div className='mainDialogoConfirmacion'>
                <div className='topConfirmacion'>
                    <IoAlertCircleOutline className='alertIcon' />
                    <p>{title}</p>
                    <IoCloseCircleOutline className='closeIcon' onClick={onClose} />
                </div>

                <div className='medioConfirmacion'>
                    <p>{content}</p>
                </div>

                <div className='botonesConfirmacion'>
                    <Button onClick={onClose}
                        sx={{
                            backgroundColor: 'red', color: 'white', paddingLeft: '22px', paddingRight: '22px'
                            , '&:hover': {
                                backgroundColor: 'red'
                            }
                        }}>
                        Close
                    </Button>
                </div> 
            </div>
        </Dialog>
    );
};

export default AlertDialog;