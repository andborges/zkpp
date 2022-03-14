import React from 'react';
import _ from 'lodash';
import moment from 'moment';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import Feed from './Feed';
import groupByDay from './groupByDay';

const styles = {
    root: {
        width: '100%',
        margin: 'auto',
    },
    day: {
        marginBottom: '1em',
    },
};

const FeedTimelineView = ({
    feed = [],
    handleLoadMore,
    total,
    classes,
}) => {
    const { days, itemsByDay } = groupByDay(feed);

    if (days.length === 0) {
        return (
            <Typography>
                Loading...
            </Typography>
        );
    }

    return (
        <div className={classes.root}>
            {_.sortBy(days).reverse().map(day => (
                <div key={day} className={classes.day}>
                    <Typography variant="subtitle2" gutterBottom>
                        {moment(day).format('dddd, LL')}
                    </Typography>
                    <Feed items={_.sortBy(itemsByDay[day], ['createdAt']).reverse()} />
                </div>
            ))}
            {feed.length < total && (
                <Button variant="contained" onClick={handleLoadMore}>
                    Load more events
                </Button>
            )}
        </div>
    );
};

const FeedTimeline = withStyles(styles)(FeedTimelineView);

export default FeedTimeline;
