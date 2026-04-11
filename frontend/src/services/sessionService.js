import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Start a new interview session.
 *
 * @param {{
 *   companies:    string[],
 *   style:        'Friendly' | 'Challenge' | 'Thinking',
 *   role:         string,
 *   topics:       string[],
 *   difficulties: string[],
 * }} params
 *
 * @returns {Promise<{
 *   session_id:    string,
 *   question:      { title: string, description: string, constraints: string[] },
 *   solution_set:  object[],
 *   hints:         string[],
 *   persona_config: object,
 * }>}
 */
export async function startSession({ companies, style, role, topics, difficulties }) {
  const { data } = await api.post('/api/sessions/start/', {
    company_tags: companies,
    style,
    role:         role         || null,
    topics:       topics.length       ? topics       : null,
    difficulties: difficulties.length ? difficulties : null,
  });
  return data;
}
