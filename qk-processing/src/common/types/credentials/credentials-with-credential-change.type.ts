import { Prisma, PrismaClient } from "@prisma/client";

// Function definition that returns a partial structure
async function getCredentialsWithCredentialChange(): Promise<any> {
  const prisma = new PrismaClient();
  return await prisma.credential.findMany({ include: { credentialChanges: true } });
}

export type CredentialsWithCredentialChange = Prisma.PromiseReturnType<typeof getCredentialsWithCredentialChange>
