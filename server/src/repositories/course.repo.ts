import { pool } from '../db.js';
export async function listCourses() {
  const [rows] = await pool.query('SELECT * FROM courses ORDER BY title');
  // @ts-ignore
  return rows;
}
export async function isUserEnrolled(userId:number, courseId:number) {
  const [rows]: any = await pool.query('SELECT 1 FROM user_courses WHERE user_id=? AND course_id=?',[userId, courseId]);
  return rows.length>0;
}
