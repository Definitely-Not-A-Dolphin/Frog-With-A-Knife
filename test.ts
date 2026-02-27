import db from "$src/db.ts";

for (let i = 1; i <= 3; i++) {
  db.sql`
  INSERT INTO meow (userId, guildId, timestamp)
  VALUES (756201477181014066, 1363979886838022176, ${Date.now()});
`;
}
for (let i = 1; i <= 2; i++) {
  db.sql`
    INSERT INTO meow (userId, guildId, timestamp)
    VALUES (783447871596920892, 1363979886838022176, ${Date.now()});
  `;
}
