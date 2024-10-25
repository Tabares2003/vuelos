import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const InputMui = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-root': {
        color: 'black', // Color negro
        backgroundColor: theme.palette.background.paper,
        borderRadius: 4,
        minHeight: '44px', // Altura de 39px
        width: '100%', // Ancho del 100%
        fontWeight: 400, // Peso de fuente 400
        fontSize: '14px', // Tamaño de fuente 14px
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#e2e2e2', // Borde gris claro
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#e2e2e2', // Borde gris claro al pasar el mouse
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#e2e2e2', // Borde gris claro al enfocar
    },
    '&.Mui-focused .MuiInputBase-root': {
        color: 'black', // Mantener el color negro al enfocar
    },
}));

export default InputMui;