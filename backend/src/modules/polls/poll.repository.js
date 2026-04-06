import { pool } from "../../config/db.js";

const mapPoll = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  startTime: row.start_time,
  endTime: row.end_time,
  status: row.status,
  createdAt: row.created_at
});

export const pollRepository = {
  async list({ limit, offset }) {
    const query = `
      SELECT id, title, description, start_time, end_time, status, created_at
      FROM polls
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const { rows } = await pool.query(query, [limit, offset]);
    return rows.map(mapPoll);
  },

  async count() {
    const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM polls");
    return rows[0].count;
  },

  async findById(id) {
    const { rows } = await pool.query(
      "SELECT id, title, description, start_time, end_time, status, created_at FROM polls WHERE id = $1",
      [id]
    );
    return rows[0] ? mapPoll(rows[0]) : null;
  },

  async getOptions(pollId) {
    const { rows } = await pool.query(
      "SELECT id, text FROM options WHERE poll_id = $1 ORDER BY id ASC",
      [pollId]
    );
    return rows;
  },

  async create(client, payload) {
    const query = `
      INSERT INTO polls (title, description, start_time, end_time, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, description, start_time, end_time, status, created_at
    `;
    const values = [payload.title, payload.description, payload.startTime, payload.endTime, payload.status];
    const { rows } = await client.query(query, values);
    return mapPoll(rows[0]);
  },

  async insertOptions(client, pollId, options) {
    const values = [];
    const placeholders = options
      .map((text, index) => {
        const base = index * 2;
        values.push(pollId, text);
        return `($${base + 1}, $${base + 2})`;
      })
      .join(", ");

    const query = `INSERT INTO options (poll_id, text) VALUES ${placeholders}`;
    await client.query(query, values);
  },

  async update(client, id, payload) {
    const query = `
      UPDATE polls
      SET title = $1, description = $2, start_time = $3, end_time = $4, status = $5
      WHERE id = $6
      RETURNING id, title, description, start_time, end_time, status, created_at
    `;
    const values = [payload.title, payload.description, payload.startTime, payload.endTime, payload.status, id];
    const { rows } = await client.query(query, values);
    return rows[0] ? mapPoll(rows[0]) : null;
  },

  async delete(id) {
    const { rowCount } = await pool.query("DELETE FROM polls WHERE id = $1", [id]);
    return rowCount > 0;
  },

  async replaceOptions(client, pollId, options) {
    await client.query("DELETE FROM options WHERE poll_id = $1", [pollId]);
    await this.insertOptions(client, pollId, options);
  }
};
