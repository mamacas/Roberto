'use strict';

/**
 * setCountdown responds to Slash Command '/countdown' when a valid time input in HH:MM:SS format follows the command.
 * @param {object} command an object containing information related to user input object, including these properties:
 *
 * user_id,
 *
 * text
 * @param {function} say prompts app to output the response passed into it as a parameter.
 */
const setCountdown = async (command, say) => {

  /**
   * regx a regular expression pattern to be checked against the User Input (command.text). User Input must match [[0-9][0-9]]:[[0-5][0-9]]:[[0-5][0-9]].
   */
  let regx = /^[0-9]{2}[:]{1}[0-5]{1}[0-9]{1}[:]{1}[0-5]{1}[0-9]{1}$/;

  let time = command.text;
  let valid = regx.test(time);

  if (valid) {
    await say(`Setting countdown for ${time} for <@${command.user_id}>.`);

    let millis = convertHMS(time);

    setTimeout(async () => {
      await say(`<@${command.user_id}>, your ${time} is up!`);
    }, millis);

  } else {
    say(`Oops! It looks like you are trying to set a countdown, <@${command.user_id}>. Try again, and please use HH:MM:SS format. For example: 00:30:00 will set a countdown for 30 minutes.`);
  }
};


/**
 * convertHMS acts as a helper function to convert HH:MM:SS time format to milliseconds so that it works with setTimeout in setCountdown.
 * @param {string} time a string representing the time the user wants to set a countdown for, in HH:MM:SS format, passed by the user in command.text.
 */
const convertHMS = (time) => {
  let timesplit = time.split(':');
  return( (+timesplit[0] * (60000 * 60)) + (+timesplit[1] * 60000) + (+timesplit[2] * 1000) );
};


module.exports = {
  setCountdown: setCountdown,
  convertHMS: convertHMS,
};
