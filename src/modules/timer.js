'use strict';

const moment = require('moment');

/**
 * timeMap object to store user.
 */
let timeMap = {};

/**
 * setTimer helps set timer for user using moment library.
 * @param {object} command an object received from the Slack API.
 * @param {SlackCommandMiddlewareArgs} say callback function to give response to user.
 */
async function setTimer(command, say) {
    let currentTime = moment();
    let user;
    if (command.text.includes('@')) {
        user = command.text.split(' ').filter(word => word.includes('@'))[0].replace("@", '');
        addTomap(currentTime, user, command.user_name);
        await say(`<@${user}>,  <@${command.user_name}> just started timer for you.`);
    } else {
        user = command.user_name;
        addTomap(currentTime, user);
        await say(`<@${command.user_name}> your timer is set.`);
    }
}


/**
 * stopTimer helps stop timer and get response with time user spent.
 * @param {object} command an object received from the Slack API.
 * @param {SlackCommandMiddlewareArgs} say callback function to give response to user.
 */
async function stopTimer(command, say) {
    let user;
    let userName;
    let forAnotherUser = false;
    if (command.text.includes('@')) {
        user = command.text.split(' ').filter(word => word.includes('@'))[0].replace("@", '');
        userName = `<@${user}>`;
        forAnotherUser = true;
    } else {
        user = command.user_name;
        userName = `<@${user}>`;
    }
    if (!timeMap[user]) {
        await say(`Timer for ${userName} is not set yet.`);
    } else {
        if (forAnotherUser && !timeMap[user].users.includes(command.user_name)) {
            say(`Sorry <@${command.user_name}> you cannot perform this operation`);
        } else {
            let timeSpent = calculateTime(user);
            delete timeMap[user];
            await say(`${userName} spent ${timeSpent}`);
        }
    }
}


/**
 * getTimer helps get current spent time whout stopping timer.
 * @param {object} command an object received from the Slack API.
 * @param {SlackCommandMiddlewareArgs} say callback function to give response to user.
 */
async function getTimer(command, say) {
    let user;
    let userName;
    if (command.text.includes('@')) {
        user = command.text.split(' ').filter(word => word.includes('@'))[0].replace('@', '');
        userName = `<@${user}>`;
    } else {
        user = command.user_name;
        userName = `<@${user}>`;
    }
    if (!timeMap[user]) {
        await say(`Timer for ${userName} is not set yet.`);
    } else {
        let timeSpent = calculateTime(user);
        await say(` ${userName}  your current time is ${timeSpent}`);
    }
}


/**
 * addTomap adds to the timeMap object currentTime, user, and forUser if the timer is set for someone else.
 * @param {moment_Object} currentTime - captures time stamp.
 * @param {string} user who set the timer.
 * @param {string} forUser who the timer is meant for.
 */
let addTomap = function (currentTime, user, forUser) {
    timeMap[user] = { time: currentTime, users: [user] };
    if (forUser) {
        timeMap[user].users.push(forUser);
    }
};


/**
 * calculateTime helper function to calculate the time difference between the beginning and end of timer.
 * @param {string} name of the user setting timer.
 */
function calculateTime(user) {
    let endTime = moment();
    let startTime = timeMap[user].time;
    let totalTime = moment.utc(endTime.diff(startTime)).format('HH:mm:ss').split(':');
    let hours = parseInt(totalTime[0]) > 0 ? parseInt(totalTime[0]) : null;
    let minutes = parseInt(totalTime[1]) > 0 ? parseInt(totalTime[1]) : null;
    let seconds = parseInt(totalTime[2]) > 0 ? parseInt(totalTime[2]) : null;

    let timeSpent = '';
    if (hours) {
        timeSpent += `${hours} hour `;
    }
    if (minutes) {
        timeSpent += `${minutes} min `;
    }
    if (seconds) {
        timeSpent += `${seconds} sec `;
    }
    return timeSpent;
}


module.exports = {
    setTimer: setTimer,
    stopTimer: stopTimer,
    getTimer: getTimer,
};
