import * as courseRepo from "../repositories/course.repo";
import * as userRepo from "../repositories/user.repo";

export const list = () => courseRepo.list();
export const enroll = (userId:number, courseIds:number[]) => userRepo.enroll(userId, courseIds);
export const isUserEnrolled = courseRepo.isUserEnrolled;
