import React, { useContext, useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  CssBaseline,
  Grid,
  Button,
  TextField,
  Typography,
} from '@material-ui/core/';
import { Context } from '../../store/store';
import Api from '../../api/api';

const useStyles = makeStyles((theme) => ({
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
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();
  const [state, store] = useContext(Context);
  const [redirect, setRedirect] = useState(null);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [confirm, setConfirm] = useState('');
  const [confirmError, setConfirmError] = useState(null);

  useEffect(() => {
    if (state.username || state.token || state.uuid) {
      setRedirect('/');
    }
  }, []);

  const usernameInput = (e) => {
    setUsername(e.target.value);
    if (e.target.value.length < 4) {
      setUsernameError('Username too short');
    } else if (e.target.value.length > 20) {
      setUsernameError('Username too long');
    } else {
      setUsernameError(null);
    }
  };

  const passwordInput = (e) => {
    setPassword(e.target.value);
    if (confirm !== null && confirm !== e.target.value) {
      setConfirmError('Passwords don\'t match');
    } else {
      setConfirmError(null);
    }
    if (e.target.value.length < 7) {
      setPasswordError('Password too short');
    } else if (e.target.value.length > 64) {
      setPasswordError('Password too long');
    } else {
      setPasswordError(null);
    }
  };

  const confirmInput = (e) => {
    setConfirm(e.target.value);
    if (e.target.value !== password) {
      setConfirmError('Passwords don\'t match');
    } else {
      setConfirmError(null);
    }
  };

  const handleSubmit = async () => {
    if (!username || !password || !confirm) return;
    if (usernameError || passwordError || confirmError) return;
    setError(null);
    const { err } = await Api.register({ username, password });
    if (err) {
      setError(err.message);
    } else {
      store({ action: 'saveSuccess', success: true });

      setRedirect('/login');
    }
  };

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <div className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            error={Boolean(usernameError)}
            helperText={usernameError}
            onChange={usernameInput}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            error={Boolean(passwordError)}
            helperText={passwordError}
            onChange={passwordInput}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirm"
            label="Confirm Password"
            type="password"
            error={Boolean(confirmError)}
            helperText={confirmError}
            onChange={confirmInput}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          {error
            ? (
              <Typography variant="caption" color="error">
                {error}
                <br />
                <br />
              </Typography>
            ) : null}
          <Grid container>
            <Grid item>
              <Link to="/login">
                Already have an account? Sign In
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    </Container>
  );
}
