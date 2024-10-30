-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "post_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userIdEdit" TEXT,
    "adminIdEdit" TEXT,
    "title" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lat" REAL NOT NULL,
    "long" REAL NOT NULL,
    "location" TEXT NOT NULL,
    CONSTRAINT "Post_userIdEdit_fkey" FOREIGN KEY ("userIdEdit") REFERENCES "User" ("user_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Post_adminIdEdit_fkey" FOREIGN KEY ("adminIdEdit") REFERENCES "Admin" ("admin_id") ON DELETE SET NULL ON UPDATE CASCADE
);
