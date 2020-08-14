import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import GitHubIcon from '@material-ui/icons/GitHub';
import EmailIcon from '@material-ui/icons/Email';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: 'white',
    color: 'black',
  },
  contriButton: {
    marginRight: '20px',
  },
  dialogHeader: {
    background: 'black',
    color: 'white',
  },
  text: {
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingRight: '30px',
    paddingLeft: '30px',
  },
});

function SimpleDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title" className={classes.dialogHeader}>
        Contact User
      </DialogTitle>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <GitHubIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Github"
            secondary={
              props.details.github_id ? props.details.github_id : 'Not found'
            }
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <EmailIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="Email Id"
            secondary={
              props.details.user.email ? props.details.user.email : 'Not found'
            }
          />
        </ListItem>
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function SimpleDialogDemo(props) {

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(props);
  const [contributorDetails, setContributor] = React.useState(props.details[0]);

  const handleClickOpen = (contributor) => {
    setContributor(contributor)
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <React.Fragment>
      <div>
        {props.details.map((contributor) => {
          return (
            <React.Fragment>
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={handleClickOpen.bind('this', contributor)}
                className={classes.contriButton}
              >
                <div className={classes.text}>
                  {contributor.user.first_name +
                    ' ' +
                    contributor.user.last_name}
                </div>
              </Button>
            </React.Fragment>
          );
        })}
        <SimpleDialog
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
          details={contributorDetails}
        />
      </div>
    </React.Fragment>
  );
}
