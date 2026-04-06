import { pool } from "../../config/db.js";

export const resultsRepository = {
  async getPollResults(pollId) {
    const query = `
      SELECT
        o.id AS option_id,
        o.text AS option_text,
        COUNT(v.id)::int AS votes_count
      FROM options o
      LEFT JOIN votes v ON o.id = v.option_id
      WHERE o.poll_id = $1
      GROUP BY o.id, o.text
      ORDER BY o.id ASC
    `;

    const { rows } = await pool.query(query, [pollId]);
    const totalVotes = rows.reduce((acc, row) => acc + row.votes_count, 0);

    return {
      totalVotes,
      options: rows.map((row) => ({
        optionId: row.option_id,
        text: row.option_text,
        votes: row.votes_count,
        percentage: totalVotes === 0 ? 0 : Number(((row.votes_count / totalVotes) * 100).toFixed(2))
      }))
    };
  }
};
