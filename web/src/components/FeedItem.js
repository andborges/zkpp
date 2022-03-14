import React from 'react';
import moment from 'moment';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { withStyles } from '@material-ui/core/styles';
import Avatar from './Avatar';

const styles = {
    content: {
        width: 500
    },
};

const FeedItemView = ({ item, classes }) => (
    <ListItem alignItems="flex-start">
        <ListItemAvatar>
            <Avatar user={item.author} />
        </ListItemAvatar>
        <ListItemText
            primary={
                <div className={classes.content}>
                    <strong>{item.author ? item.author.name : 'Anonymous'}</strong>
                    {' '}
                    {item.content}
                </div>
            }
            secondary={moment(item.createdAt).format('LLLL')}
        />
    </ListItem>
);

const FeedItem = withStyles(styles)(FeedItemView);

export default FeedItem;
