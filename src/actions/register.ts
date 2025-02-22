"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { GetUserByEmail } from "./user";

export const register = async (data: { email: string; password: string; username: string }) => {

    if (!data.email || !data.password || !data.username) {
        return { error: "All fields are required" };
    }

    const userExists = await GetUserByEmail(data.email);
    if (userExists) {
        return { error: "user already exist" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // ✅ Explicitly match Prisma.UserCreateInput
    const newUser = {
        email: data.email,
        password: hashedPassword,
        username: data.username,
    };

    const user = await prisma.user.create({ data: newUser });

    return { success: "User created successfully", user };
};
