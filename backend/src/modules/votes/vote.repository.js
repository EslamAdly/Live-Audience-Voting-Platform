import { pool } from "../../config/db.js";

export const voteRepository = {
  async findPollWithOption(pollId, optionId) {
    const query = `
      SELECT
        p.id AS poll_id,
        p.start_time,
        p.end_time,
        p.status,
        EXISTS (
          SELECT 1 FROM options o WHERE o.id = $2 AND o.poll_id = p.id
        ) AS has_option
      FROM polls p
      WHERE p.id = $1
    `;
    const { rows } = await pool.query(query, [pollId, optionId]);
    return rows[0] || null;
  },

  async createVote({ pollId, optionId, voterIp, sessionToken }) {
    const query = `
      INSERT INTO votes (poll_id, option_id, voter_ip, session_token)
      VALUES ($1, $2, $3, $4)
      RETURNING id, poll_id, option_id, created_at
    `;
    const { rows } = await pool.query(query, [pollId, optionId, voterIp, sessionToken]);
    return rows[0];
  }
};
