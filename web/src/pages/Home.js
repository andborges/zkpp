import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

import FeedTimeline from '../components/FeedTimeline';

import useApi from '../hooks/useApi';
import useContent from '../hooks/useContent';
import useForm from '../hooks/useForm';
import useToken from '../hooks/useToken';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  menu: {
    marginTop: theme.spacing(2)
  },
  title: {
    display: 'block'
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(1, 0, 2),
  },
  card: {
    display: 'flex',
  },
  cardDetails: {
    flex: 1,
  }
}));

const {
  api
} = useApi();

const {
  readContent,
  saveContent
} = useContent();

const {
  getFirstName,
  getName,
  getDefaultContentId
} = useToken();

export default function Home() {
  const [defaultFeed, setDefaultFeed] = useState([]);

  useEffect(() => {
    api
      .get('/api/v1/feed/' + getDefaultContentId())
      .then(result => {
        const data = result.data.map(feedItem => {
          return {
            id: feedItem._id,
            createdAt: feedItem.createdAt,
            content: readContent(getDefaultContentId(), feedItem.nonce, feedItem.content)
          };
        });

        setDefaultFeed(data);
      });
  }, []);

  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();

  const isMenuOpen = Boolean(anchorEl);

  function handleProfileMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  };

  function handleMenuClose() {
    setAnchorEl(null);
  };

  function handleLogoutMenu() {
    window.location = '/logout';
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>{t('Common.Profile')}</MenuItem>
      <MenuItem onClick={handleLogoutMenu}>{t('Common.Logout')}</MenuItem>
    </Menu>
  );

  const whatsHappeningValidate = () => {
    let errors = {};

    return errors;
  };

  const whatsHappeningCallback = () => {
    const cipheredContent = saveContent(getDefaultContentId(), whatsHappeningForm.values.post);

    api.post('/api/v1/feed/' + getDefaultContentId(), {
      nonce: cipheredContent.nonce,
      content: cipheredContent.cipheredText
    })
    .then(result => {
      const newFeedItem = {
        id: result.data._id,
        createdAt: result.data.createdAt,
        content: readContent(getDefaultContentId(), result.data.nonce, result.data.content)
      };

      setDefaultFeed([...defaultFeed, newFeedItem]);
      whatsHappeningForm.reset();
    });
  };

  const whatsHappeningForm = useForm(whatsHappeningCallback, whatsHappeningValidate);

  const whatsHappening = (
    <form className={classes.form} onSubmit={whatsHappeningForm.handleSubmit} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <TextField
            id="post"
            name="post"
            label={t('Field.WhatsHappening.Label', { name: getFirstName() })}
            value={whatsHappeningForm.values.post || ''}
            variant="filled"
            fullWidth
            error={whatsHappeningForm.errors.post !== undefined}
            autoFocus
            onChange={whatsHappeningForm.handleChange}
            onBlur={whatsHappeningForm.handleBlur}
            helperText={whatsHappeningForm.errors.post || ' '}
          />
        </Grid>

        <Grid item xs={2}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            color="primary"
            className={classes.submit}
          >
            {t("Button.Ok")}
          </Button>
        </Grid>
      </Grid>
    </form>
  );

  return (
    <React.Fragment>
      <CssBaseline />

      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Zyou
          </Typography>
          <div className={classes.grow} />
          <div>
            <Button
              onClick={handleProfileMenuOpen}
              aria-label="Current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle className={classes.icon} />
              <Typography>
                {t('Common.Welcome')}, {getName()}
              </Typography>
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}

      <Container component="main">
        <Grid container spacing={2}>
            <Grid item xs={2}>
              <List className={classes.menu}>
                <ListItem button component={RouterLink} to="/" selected={true}>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={RouterLink} to="/community/create">
                  <ListItemText primary="Criar comunidade" />
                </ListItem>
                <ListItem component={RouterLink} to="/people/find" button>
                  <ListItemText primary="Buscar pessoas" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={7}>
              {whatsHappening}

              <FeedTimeline
                feed={defaultFeed}
                total={100}
              />
          </Grid>
          <Grid item xs={3}>
              Right
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}