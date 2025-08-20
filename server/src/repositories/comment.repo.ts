import { pool } from '../db.js';
export async function listByAnnouncement(announcementId:number){
  const [rows] = await pool.query(`
    SELECT c.*, u.name AS author_name FROM comments c
    JOIN users u ON u.id=c.user_id
    WHERE c.announcement_id=? ORDER BY c.created_at ASC
  `,[announcementId]);
  // @ts-ignore
  return rows;
}
export async function create(announcementId:number, userId:number, body:string){
  const [res]: any = await pool.query(
    'INSERT INTO comments (announcement_id,user_id,body) VALUES (?,?,?)',[announcementId,userId,body]);
  return res.insertId as number;
}
export async function update(id:number, userId:number, body:string){
  await pool.query('UPDATE comments SET body=? WHERE id=? AND user_id=?',[body,id,userId]);
}
export async function remove(id:number, userId:number){
  await pool.query('DELETE FROM comments WHERE id=? AND user_id=?',[id,userId]);
}
export async function getOwner(id:number){
  const [rows]: any = await pool.query('SELECT user_id FROM comments WHERE id=?',[id]);
  return rows[0]?.user_id as number | undefined;
}
