-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL DEFAULT '#64748b',
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_categories" ("color", "createdAt", "description", "icon", "id", "name", "order", "slug", "updatedAt") SELECT "color", "createdAt", "description", "icon", "id", "name", "order", "slug", "updatedAt" FROM "categories";
DROP TABLE "categories";
ALTER TABLE "new_categories" RENAME TO "categories";
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
CREATE TABLE "new_resources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT,
    "categoryId" TEXT NOT NULL,
    "tags" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "resources_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_resources" ("categoryId", "createdAt", "description", "id", "isFeatured", "name", "slug", "tags", "updatedAt", "url", "viewCount") SELECT "categoryId", "createdAt", "description", "id", "isFeatured", "name", "slug", "tags", "updatedAt", "url", "viewCount" FROM "resources";
DROP TABLE "resources";
ALTER TABLE "new_resources" RENAME TO "resources";
CREATE UNIQUE INDEX "resources_slug_key" ON "resources"("slug");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "avatar" TEXT,
    "bio" TEXT,
    "reputation" INTEGER NOT NULL DEFAULT 1,
    "badge" TEXT NOT NULL DEFAULT 'BRONZE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("avatar", "badge", "bio", "createdAt", "email", "id", "name", "password", "reputation", "updatedAt") SELECT "avatar", "badge", "bio", "createdAt", "email", "id", "name", "password", "reputation", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
