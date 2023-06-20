import { CredentialStatus, Prisma, PrismaClient, Role, UserStatus } from "@prisma/client";

// Function definition that returns a partial structure
async function getCredentialWithEverything(uuid: string): Promise<any> {
  const prisma = new PrismaClient();
  return await prisma.credential.findFirst({
    where:{
      OR: [
        { uuid: uuid },
      ],
      NOT: { status: { equals: CredentialStatus.DELETED } },
    },
    include: {
      credentialChanges: { orderBy: { createdAt: "desc" } },
      institution: {
        include: {
          representatives: {
            where: { status: UserStatus.ACTIVE, role: Role.INSTITUTION_REPRESENTATIVE },
            select: {
              fullName: true,
              signatureUrl: true,
              title: true,
            },
          },
        },
      },
    },
  });
}

export type CredentialWithEverythingType = Prisma.PromiseReturnType<typeof getCredentialWithEverything>
