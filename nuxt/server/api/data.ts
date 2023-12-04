import {H3Event} from "h3";
import pgPromise from "pg-promise";
import {formatDateTime, toUtcTime} from "~/server/helpers/formatDate";
import {SQLBuilder} from "~/server/helpers/SQLBuilder";

const pgp = pgPromise();
const db = pgp(process.env.POSTGRES_CONNECTION_STRING);
const sqlBuilder = new SQLBuilder();

export default defineEventHandler(async (event: H3Event<Request>) => {
  if (event.method === 'GET') {
    try {
      let { selectedDate, startTime, endTime } = getQuery(event);
      startTime = toUtcTime(selectedDate, startTime);
      endTime = toUtcTime(selectedDate, endTime);

      try {
        const queryResult = await db.any(sqlBuilder
          .selectAll()
            .from('bitcoin_prices')
            .where(`time >= '${selectedDate} ${startTime}'`)
            .and(`time <= '${selectedDate} ${endTime}'`)
          .build()
        );

        const formattedData = {
          labels: queryResult.map(row => formatDateTime(row.time)),
          datasets: [{
            label: 'Bitcoin Price',
            data: queryResult.map(row => row.rate),
          }]
        };

        return formattedData;
      } catch (err) {
        console.log(err);
        return {
          error: 'Internal server Error',
        }
      }
    } catch (err) {
      console.log(err);
      return { error: 'Internal Server Error' };
    }
  }
})