import config from '../utils/config.js'
import logger from "../utils/logger.js";
import pkg from 'pg';
const { Pool } = pkg;

const db = new Pool({
  user: config.PG_USER,
  host: config.PG_HOST,
  database: config.PG_DB,
  password: config.PG_PASSWORD,
  port: config.PG_PORT,
});

(async () => {  
  try {
    const client = await db.connect();
    const result = await client.query('SELECT NOW()');
    logger.info(`🌮PostgreSQL connected successfully: ${result.rows[0].now}`);
  } catch (err) {
    logger.error(err);
    logger.info('🌋Error connecting to PostgreSQL');
  }
})();

export const storeNest = async (nestId, originIp) => {
  const sqlQuery = `
    INSERT INTO 
        nests (id, origin_ip, created_on) 
    VALUES 
        ($1, $2, NOW())
  `

  try {
    const result = await db.query(
      sqlQuery,
      [nestId, originIp]
    );
    return result.rows[0];
  } catch (error) {
    logger.error(error);
  }
}

export const storeRequest = async ({id, nestId, origin, originIp, method, path, query, headers, body}) => {
  const queryJSON = JSON.stringify(query)
  const headersJSON = JSON.stringify(headers)
  const bodyJSON = JSON.stringify(body)
  const sqlQuery = `
      INSERT INTO 
        requests (id, nest_id, origin, origin_ip, method, path, query, headers, body, arrived_on) 
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
      `

  try {
    const result = await db.query(
      sqlQuery,
      [id, nestId, origin, originIp, method, path, queryJSON, headersJSON, bodyJSON]
    );
    return result.rows[0];
  } catch (error) {
    logger.error(error);
  }
}

export const storeWSMessage = async ({id, nestId, serverURL, data}) => {
  const dataJSON = JSON.stringify(data)
  const sqlQuery = `
    INSERT INTO 
        ws_messages (id, nest_id, server_url, data, arrived_on) 
    VALUES 
        ($1, $2, $3, $4, NOW())
    `

  try {
    const result = await db.query(
      sqlQuery,
      [id, nestId, serverURL, dataJSON]
    );
    return result.rows[0];
  } catch (error) {
    logger.error(error);
  }
}

export const getNest = async (nestId) => {
  const sqlQuery = `
    SELECT
        nests.id AS nest_id,
        nests.origin_ip AS nest_ip,
        nests.created_on AS nest_created_on,
        requests.id,
        requests.method,
        requests.origin,
        requests.origin_ip,
        requests.query,
        requests.path,
        requests.headers,
        requests.body,
        requests.arrived_on
    FROM
        nests
    LEFT JOIN
        requests ON nests.id = requests.nest_id
    WHERE
        nests.id = $1;
    `
  try {
    const result = await db.query(
      sqlQuery,
      [nestId]
    );
    return result.rows;
  } catch (error) {
    logger.error(error);
  }
}

export const getWSMessages = async (nestId, wsServerURL) => {
  const sqlQuery = `
    SELECT
        ws_messages.id,
        ws_messages.nest_id,
        ws_messages.server_URL,
        ws_messages.data,
        ws_messages.arrived_on
    FROM
        ws_messages
    WHERE
        ws_messages.nest_id = $1
        AND ws_messages.server_URL = $2;
  `

  try {
    const result = await db.query(
      sqlQuery,
      [nestId, wsServerURL]
    );
    return result.rows;
  } catch (error) {
    logger.error(error);
  }
}