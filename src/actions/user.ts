import { prisma } from "@/lib/prisma";

export const GetUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    return user;
}