const getDayForEvent = event => {
    const date = new Date(event.createdAt);
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);

    return date.toISOString();
};

const groupByDay = events => {
    const groups = events.reduce((days, event) => {
        const day = getDayForEvent(event);

        if (!days[day]) {
            days[day] = [];
        }

        days[day] = days[day].concat(event);

        return days;
    }, {});

    return {
        days: Object.keys(groups),
        itemsByDay: groups,
    };
};

export default groupByDay;