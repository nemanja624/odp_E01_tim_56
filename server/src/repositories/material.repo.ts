import { pool } from '../db.js';
export async function create(courseId:number, userId:number, title:string, description:string|undefined, file_url:string, mime:string){
  const [res]: any = await pool.query(
    'INSERT INTO materials (course_id,user_id,title,description,file_url,mime_type) VALUES (?,?,?,?,?,?)',
    [courseId,userId,title,description||null,file_url,mime]);
  return res.insertId as number;
}
export async function listByCourse(courseId:number){
  const [rows] = await pool.query(`
    SELECT m.*, u.name as author_name FROM materials m
    JOIN users u ON u.id=m.user_id
    WHERE m.course_id=? ORDER BY m.created_at DESC
  `,[courseId]);
  // @ts-ignore
  return rows;
}
export async function remove(id:number, userId:number){
  await pool.query('DELETE FROM materials WHERE id=? AND user_id=?',[id,userId]);
}
export async function getById(id:number){
  const [rows] = await pool.query('SELECT * FROM materials WHERE id=?',[id]);
  // @ts-ignore
  return rows[0];
}

export async function removeById(id:number){
  await pool.query('DELETE FROM materials WHERE id=?',[id]);
} 
