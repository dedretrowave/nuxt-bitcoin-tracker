const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION,
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

let client;

async function init() {
  client = await pool.connect();

  await fetchCurrentPrice();

  setInterval(fetchCurrentPrice, 120000);
}

async function fetchCurrentPrice() {
  try {
    const response = await fetch('https://rest.coinapi.io/v1/exchangerate/BTC/USD', {
      headers: {
        'X-CoinAPI-Key': process.env.COINAPI_KEY,
      },
    });
    let data = await response.json();

    try {
      data = {
        ...data,
        asset_id_base: `'${data.asset_id_base}'`,
        asset_id_quote: `'${data.asset_id_quote}'`,
        time: `TIMESTAMP '${data.time}'`,
      }

      await client
        .query(`INSERT INTO bitcoin_prices (${Object.keys(data).join(",")}) VALUES (${Object.values(data).join(',')}) RETURNING *`);
    } catch (err) {
      throw err;
    }
  } catch (err) {
    console.error(err);
    return {
        error: 'Internal Server Error',
    };
  }
}
init();

app.listen(port, () => {
  console.log(`SERVER RUNNING ON ${port}`);
})