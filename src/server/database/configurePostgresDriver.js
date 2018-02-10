import _ = from 'lodash';
import pg = from 'pg';


const pgTypes = pg.types;

/**
 * Configures the Postgres driver.
 * Should be run in the application initialization code before initializing knex.
 */
const configurePostgresDriver = _.once(() => {

  // Don't parse timestamps to JS Date() objects, but just ISO8601 strings.
  pgTypes.setTypeParser(1184, val => {
    if (val === null) {
      return null;
    }

    /**
     * Supports the following formats:
     *   2014-09-23 15:29:18.37788+03,
     *   2014-09-23 15:29:18.37788+03
     *   2014-09-23 15:29:18-03
     *   2014-09-23 15:29:18.38+03:30
     *   2014-09-23 15:29:18+00
     *   2014-09-23 15:29:18.38
     *
     * Output is:
     * [
     *   "2014-09-23 15:29:18.38+03:30",
     *   "2014-09-23",
     *   "15:29:18",
     *   ".38",
     *   "38",
     *   "+03:30",
     *   "+","03",":30","30"
     * ]
     */
    const parsedDateTime = val.match(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})(\.(\d+))?(([+-])(\d{2})(:(\d{2}))?)?/);
    const parsedSubSecond = parsedDateTime[4];
    const milliseconds = parsedSubSecond ? parseFloat(parsedDateTime[3]).toPrecision(3).substring(1) : ".000";
    const parsedTimeZone = parsedDateTime[5];
    let isoTimeZone = "Z";

    if (parsedTimeZone) {
      const sign = parsedDateTime[6];
      const hours = parsedDateTime[7];
      const minutes = parsedDateTime[9] || "00";

      isoTimeZone = sign + hours + ":" + minutes;
    }

    return parsedDateTime[1] + "T" + parsedDateTime[2] + milliseconds + isoTimeZone;
  });
});


export default configurePostgresDriver;
