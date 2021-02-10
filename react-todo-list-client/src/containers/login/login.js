import React, { useContext, useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  CssBaseline,
  Grid,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
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
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (state.username || state.token || state.uuid) {
      setRedirect('/');
    } else if (state.success) {
      setSuccess('User sucessfully created. You may now sign in.');
      store({ action: 'destroySuccess' });
    }
  }, []);

  const usernameInput = (e) => {
    if (e.target.value.length <= 20) {
      setUsername(e.target.value);
    }
  };

  const passwordInput = (e) => {
    if (e.target.value.length <= 64) {
      setPassword(e.target.value);
    }
  };

  const handleCheck = (e) => {
    setChecked(e.target.checked);
  };

  const handleSubmit = async () => {
    setError(null);
    const { err, data } = await Api.login({ username, password, remember: checked });
    if (err) {
      setError(err.message);
    } else {
      store({
        action: 'saveUser',
        uuid: data.uuid,
        token: data.token,
        username,
      });

      setRedirect('/');
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
          Sign in
        </Typography>
        {success
          ? (
            <Typography variant="caption" color="primary">
              <br />
              {success}
              <br />
            </Typography>
          ) : null}
        <div className={classes.form}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            value={username}
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
            value={password}
            onChange={passwordInput}
          />
          <FormControlLabel
            control={(
              <Checkbox
                color="primary"
                checked={checked}
                onChange={handleCheck}
              />
            )}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Sign In
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
              <Link to="/register">
                {'Don\'t have an account? Sign Up'}
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
    </Container>
  );
}
