"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { GetUserByEmail } from "./user";
import { Prisma } from "@prisma/client";

export const register = async (data: { email: string; password: string; username: string }) => {
    if (!data.email || !data.password || !data.username) {
        throw new Error("Email, password, and username are required");
    }

    const userExists = await GetUserByEmail(data.email);
    if (userExists) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // ✅ Explicitly match Prisma.UserCreateInput
    const newUser: Prisma.UserCreateInput = {
        email: data.email,
        password: hashedPassword,
        username: data.username,
    };

    const user = await prisma.user.create({ data: newUser });

    return user;
};
