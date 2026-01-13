import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";


const secretKey = process.env.JWT_SECRET!;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Kullanıcı bulunamadı");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Şifre hatalı");

  const session = await encrypt({
    userId: user.id,
    email: user.email,
  });
  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function registerAndLogin(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  const session = await encrypt({
    userId: user.id,
    email: user.email,
  });

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return user;
}


export async function getCurrentUser() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;

  const payload = await decrypt(session);

  return prisma.user.findUnique({
    where: { id: payload.userId },
  });
}


export async function logout() {
  (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = (await cookies()).get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}