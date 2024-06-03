"use server";

import { hashPassword } from "@/lib/bcrypt";
import { prisma } from "../../../prisma/prisma";

export async function createUser(userData: CreateUserType) {
  // Validations
  // 1. Same validation done in client-side
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !userData.name ||
    !userData.email ||
    !emailRegex.test(userData.email) ||
    !userData.password ||
    userData.password.length < 8
  )
    return { status: 500 };

  // 2. DB checks
  const emailExist = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });

  if (emailExist)
    return { message: "This email has already registered.", status: 500 };

  // Create user in DB if all the checking has passed
  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: await hashPassword(userData.password),
      registerType: "app",
    },
  });
  // Initialise user's calendar list with a calendar called [User's Name]
  const calendar = await prisma.calendar.create({
    data: {
      userId: user.id,
      name: user.name,
      defaultColor: "Cobalt",
    },
  });

  return { status: 200 };
}
