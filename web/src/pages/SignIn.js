import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import useToken from '../hooks/useToken';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 2),
  },
  close: {
    padding: theme.spacing(0.5),
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  }
}));

export default function SignIn() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { t } = useTranslation();
  const { signIn } = useAuth();
  const classes = useStyles();

  const validate = () => {
    let errors = {};

    if (!values.email) {
      errors.email = t('Validation.Required');
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = t('Validation.Invalid');
    }

    if (!values.password) {
      errors.password = t('Validation.Required');
    }

    return errors;
  }

  const handleSignIn = () => {
    signIn({...values}, (error, token, vaultKeyPair) => {
      if (error) {
        setError(error.response && error.response.data.errorCode ? t('Backend.' + error.response.data.errorCode) : error.message);
        return;
      }

      login(token, vaultKeyPair);

      setSuccess(true);
    });
  }

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(handleSignIn, validate);

  const {
    login,
    getVault
  } = useToken();

  if (success) {
    return (<Redirect to="/" />);
  }

  return (
    <Container component="main" maxWidth="xs">
      <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={error !== ""}
          onClose={() => { setError("") }}
          autoHideDuration={5000}
          transitionDuration={0}
          ContentProps={{
            'aria-describedby': 'message-id',
            classes: { root: classes.error }
          }}
          message={<span id="message-id">{error}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={() => { setError("") }}
            >
              <CloseIcon />
            </IconButton>
          ]}
      />

      <CssBaseline />

      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          {t("Common.SignIn")}
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            id="email"
            name="email"
            label={t("Field.EmailAddress.Label")}
            value={values.email || ''}
            variant="outlined"
            margin="normal"
            error={errors.email !== undefined}
            required
            fullWidth
            autoFocus
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={errors.email || ' '}
          />
          <TextField
            type="password"
            id="password"
            name="password"
            label={t("Field.Password.Label")}
            value={values.password || ''}
            variant="outlined"
            margin="normal"
            error={errors.password !== undefined}
            required
            autoComplete="off"
            fullWidth
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={errors.password || ' '}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {t("Button.Enter")}
          </Button>

          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                {t('Common.ForgotPasswordQuestion')}
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to="/signup" variant="body2">
                {t('Common.DontHaveAccount')}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
