import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

async function main(){
  const courses = [
    { code: "ODP101", name: "Osnove distribuiranog programiranja", description: "Uvod u distribuisane sisteme" },
    { code: "WEB202", name: "Veb aplikacije", description: "Frontend/Backend razvoj" },
    { code: "DB301", name: "Baze podataka", description: "Relacione baze i SQL" },
    { code: "PRJ400", name: "Projektni kurs", description: "Timovi i implementacija" },
  ];
  for(const c of courses){ await prisma.course.upsert({ where:{code: c.code}, update:{}, create:c }); }

  const pwd = await bcrypt.hash("password", 10);
  const prof = await prisma.user.upsert({
    where:{ email:"prof@fakultet.rs" },
    update:{},
    create:{ email:"prof@fakultet.rs", passwordHash: pwd, name:"Prof. Demo", role:"PROFESSOR" }
  });
  const stud = await prisma.user.upsert({
    where:{ email:"student@fakultet.rs" },
    update:{},
    create:{ email:"student@fakultet.rs", passwordHash: pwd, name:"Student Demo", role:"STUDENT" }
  });

  const course = await prisma.course.findFirst({ where:{ code:"ODP101" } });
  if(course){
    await prisma.enrollment.upsert({ where:{ userId_courseId: { userId: prof.id, courseId: course.id } }, update:{}, create:{ userId: prof.id, courseId: course.id } });
    await prisma.enrollment.upsert({ where:{ userId_courseId: { userId: stud.id, courseId: course.id } }, update:{}, create:{ userId: stud.id, courseId: course.id } });
  }
  console.log("Seed done.");
}

main().finally(()=>prisma.$disconnect());
