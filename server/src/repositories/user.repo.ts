import { pool } from '../db.js';
export type User = { id:number, name:string, email:string, password_hash:string, role:'PROFESSOR'|'STUDENT' };
export async function findByEmail(email: string) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email=?',[email]);
  // @ts-ignore
  return rows[0] as User | undefined;
}
export async function findById(id: number) {
  const [rows] = await pool.query('SELECT id,name,email,role FROM users WHERE id=?',[id]);
  // @ts-ignore
  return rows[0];
}
export async function createUser(name:string,email:string,hash:string,role:'PROFESSOR'|'STUDENT') {
  const [res]: any = await pool.query('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)',[name,email,hash,role]);
  return res.insertId as number;
}
export async function upsertUserCourses(userId:number, courseIds:number[]) {
  await pool.query('DELETE FROM user_courses WHERE user_id=?',[userId]);
  for (const c of courseIds) {
    await pool.query('INSERT INTO user_courses (user_id,course_id) VALUES (?,?)',[userId,c]);
  }
}
export async function getUserCourses(userId:number) {
  const [rows] = await pool.query('SELECT c.* FROM courses c JOIN user_courses uc ON uc.course_id=c.id WHERE uc.user_id=?',[userId]);
  // @ts-ignore
  return rows;
}
