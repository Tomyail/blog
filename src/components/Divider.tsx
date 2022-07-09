import { Divider, experimentalStyled } from '@mui/material';

export default experimentalStyled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));
