-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_terms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "term" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "definition" TEXT NOT NULL,
    "examples" TEXT,
    "relatedTerms" TEXT,
    "categoryId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'APPROVED',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "terms_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_terms" ("categoryId", "createdAt", "definition", "examples", "id", "relatedTerms", "slug", "status", "term", "updatedAt", "viewCount") SELECT "categoryId", "createdAt", "definition", "examples", "id", "relatedTerms", "slug", "status", "term", "updatedAt", "viewCount" FROM "terms";
DROP TABLE "terms";
ALTER TABLE "new_terms" RENAME TO "terms";
CREATE UNIQUE INDEX "terms_slug_key" ON "terms"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
