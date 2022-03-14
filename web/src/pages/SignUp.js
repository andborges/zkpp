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

import useForm from '../hooks/useForm';
import useToken from '../hooks/useToken';
import useAuth from '../hooks/useAuth';
import useContent from '../hooks/useContent';

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  close: {
    padding: theme.spacing(0.5),
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  }
}));

export default function SignUp() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { t } = useTranslation();
  const { signUp } = useAuth();
  const classes = useStyles();

  const validate = () => {
    let errors = {};

    if (!values.firstName) {
      errors.firstName = t('Validation.Required');
    }

    if (!values.lastName) {
      errors.lastName = t('Validation.Required');
    }

    if (!values.email) {
      errors.email = t('Validation.Required');
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = t('Validation.Invalid');
    }

    if (!values.password) {
      errors.password = t('Validation.Required');
    } else if (values.password.length < 8) {
      errors.password = t('Validation.MinLength', { minLength: 8 });
    }

    if (!values.confirmPassword || values.password !== values.confirmPassword) {
      errors.confirmPassword = t('Validation.PasswordNotConfirmed');
    }

    return errors;
  }

  const handleSignUp = () => {
    signUp({...values}, (error, data, vaultKeyPair) => {
      if (error) {
        setError(error.response && error.response.data.errorCode ? t('Backend.' + error.response.data.errorCode) : error.message);
        return;
      }

      login(data, vaultKeyPair);
      setSuccess(true);
    });
  }

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(handleSignUp, validate);

  const {
    login,
    getVaultSecretKey
  } = useToken();

  if (success) {
    return (<Redirect to="/" />);
  }

  return (
    <Container component="main" maxWidth="sm">
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
          {t("Common.SignUp")}
        </Typography>

        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="firstName"
                name="firstName"
                label={t("Field.FirstName.Label")}
                value={values.firstName || ''}
                variant="outlined"
                error={errors.firstName !== undefined}
                required
                fullWidth
                autoFocus
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errors.firstName || ' '}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="lastName"
                name="lastName"
                label={t("Field.LastName.Label")}
                value={values.lastName || ''}
                variant="outlined"
                error={errors.lastName !== undefined}
                required
                fullWidth
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errors.lastName || ' '}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="email"
                name="email"
                label={t("Field.EmailAddress.Label")}
                value={values.email || ''}
                variant="outlined"
                error={errors.email !== undefined}
                required
                fullWidth
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errors.email || ' '}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="password"
                id="password"
                name="password"
                label={t("Field.Password.Label")}
                value={values.password || ''}
                variant="outlined"
                error={errors.password !== undefined}
                required
                autoComplete="off"
                fullWidth
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errors.password || ' '}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                label={t("Field.ConfirmPassword.Label")}
                value={values.confirmPassword || ''}
                variant="outlined"
                error={errors.confirmPassword !== undefined}
                required
                autoComplete="off"
                fullWidth
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errors.confirmPassword || ' '}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {t("Button.Register")}
          </Button>

          <Grid container justify="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/signin" variant="body2">
                {t('Common.AlreadyHaveAccount')}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}