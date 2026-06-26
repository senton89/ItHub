const { PrismaClient } = require("@prisma/client");
const p = new PrismaClient();
p.user.findFirst()
  .then((u) => {
    if (u) return p.user.update({ where: { id: u.id }, data: { role: "ADMIN" } }).then((r) => console.log("Admin assigned:", r.id, r.name, r.email));
    else console.log("No users found");
  })
  .then(() => p.$disconnect())
  .catch((e) => { console.error(e); p.$disconnect(); });
