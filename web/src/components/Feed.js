import React from 'react';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import FeedItem from './FeedItem';

const styles = {
    root: {
        width: 600,
    },
};

const FeedView = ({ items = [], classes }) => (
    <Card className={classes.root}>
        <List>
            {items.map(item => (
                <FeedItem item={item} key={item.id} />
            ))}
        </List>
    </Card>
);

const Feed = withStyles(styles)(FeedView);

export default Feed;
