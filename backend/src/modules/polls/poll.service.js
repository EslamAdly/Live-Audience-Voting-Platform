import { pool } from "../../config/db.js";
import { ApiError } from "../../utils/ApiError.js";
import { pollRepository } from "./poll.repository.js";

const resolveStatusByTimeWindow = (poll) => {
  const now = new Date();
  const start = new Date(poll.startTime);
  const end = new Date(poll.endTime);
  const isInWindow = now >= start && now <= end;
  return { ...poll, status: isInWindow ? "active" : "inactive" };
};

const normalizePayload = (payload, existing = {}) => ({
  title: payload.title ?? existing.title,
  description: payload.description ?? existing.description,
  startTime: payload.startTime ?? existing.startTime,
  endTime: payload.endTime ?? existing.endTime,
  status: payload.status ?? existing.status,
  options: payload.options ?? null
});

export const pollService = {
  async list(page = 1, pageSize = 20) {
    const safePage = Math.max(1, Number(page));
    const safePageSize = Math.min(100, Math.max(1, Number(pageSize)));
    const offset = (safePage - 1) * safePageSize;
    const [items, total] = await Promise.all([
      pollRepository.list({ limit: safePageSize, offset }),
      pollRepository.count()
    ]);

    return { items: items.map(resolveStatusByTimeWindow), total, page: safePage, pageSize: safePageSize };
  },

  async getById(id) {
    const poll = await pollRepository.findById(id);
    if (!poll) throw new ApiError(404, "Poll not found");
    const options = await pollRepository.getOptions(id);
    return { ...resolveStatusByTimeWindow(poll), options };
  },

  async create(payload) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const poll = await pollRepository.create(client, payload);
      await pollRepository.insertOptions(client, poll.id, payload.options);
      await client.query("COMMIT");
      return this.getById(poll.id);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async update(id, payload) {
    const existing = await pollRepository.findById(id);
    if (!existing) throw new ApiError(404, "Poll not found");
    const normalized = normalizePayload(payload, existing);

    if (new Date(normalized.endTime) <= new Date(normalized.startTime)) {
      throw new ApiError(400, "endTime must be greater than startTime");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const updated = await pollRepository.update(client, id, normalized);
      if (!updated) throw new ApiError(404, "Poll not found");
      if (Array.isArray(normalized.options)) {
        await pollRepository.replaceOptions(client, id, normalized.options);
      }
      await client.query("COMMIT");
      return this.getById(id);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async remove(id) {
    const deleted = await pollRepository.delete(id);
    if (!deleted) throw new ApiError(404, "Poll not found");
  }
};
