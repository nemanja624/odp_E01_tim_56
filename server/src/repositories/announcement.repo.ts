import { pool } from '../db.js';
export type AnnouncementRow = any;
export async function create(courseId:number, userId:number, title:string, body:string|undefined, image_url:string|undefined){
  const [res]: any = await pool.query(
    'INSERT INTO announcements (course_id,user_id,title,body,image_url) VALUES (?,?,?,?,?)',
    [courseId, userId, title, body||null, image_url||null]);
  return res.insertId as number;
}
export async function update(id:number, title?:string, body?:string){
  const fields = []; const vals:any[] = [];
  if (title!==undefined) { fields.push('title=?'); vals.push(title); }
  if (body!==undefined) { fields.push('body=?'); vals.push(body); }
  if (!fields.length) return;
  vals.push(id);
  await pool.query(`UPDATE announcements SET ${fields.join(', ')} WHERE id=?`, vals);
}
export async function remove(id:number, userId:number){
  await pool.query('DELETE FROM announcements WHERE id=? AND user_id=?',[id,userId]);
}
export async function listByCourse(courseId:number, viewerId:number){
  const [rows] = await pool.query(`
    SELECT a.*, u.name as author_name,
      IFNULL(SUM(r.type='LIKE'),0) as likes,
      IFNULL(SUM(r.type='DISLIKE'),0) as dislikes,
      MAX(CASE WHEN r.user_id=? AND r.type='LIKE' THEN 1 ELSE 0 END) as me_liked,
      MAX(CASE WHEN r.user_id=? AND r.type='DISLIKE' THEN 1 ELSE 0 END) as me_disliked
    FROM announcements a
    JOIN users u ON u.id=a.user_id
    LEFT JOIN reactions r ON r.announcement_id=a.id
    WHERE a.course_id=?
    GROUP BY a.id
    ORDER BY a.created_at DESC
  `,[viewerId, viewerId, courseId]);
  // @ts-ignore
  return rows;
}
export async function setReaction(announcementId:number, userId:number, type:'LIKE'|'DISLIKE'){
  // upsert
  const [exists]: any = await pool.query('SELECT * FROM reactions WHERE announcement_id=? AND user_id=?',[announcementId,userId]);
  if (exists.length) {
    await pool.query('UPDATE reactions SET type=? WHERE id=?',[type, exists[0].id]);
  } else {
    await pool.query('INSERT INTO reactions (announcement_id,user_id,type) VALUES (?,?,?)',[announcementId,userId,type]);
  }
}
export async function getById(id:number){
  const [rows] = await pool.query('SELECT * FROM announcements WHERE id=?',[id]);
  // @ts-ignore
  return rows[0];
}
