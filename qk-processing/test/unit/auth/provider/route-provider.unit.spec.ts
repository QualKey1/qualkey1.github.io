import { Role, User, UserStatus } from "@prisma/client";

import { RoleNotFoundException } from "../../../../src/auth/exception";
import { RouteProvider } from "../../../../src/auth/provider";

describe("Route Provider Unit Tests", () => {
  const routeProvider: RouteProvider = new RouteProvider();

  const dataSet = [
    [Role.STUDENT, "/dashboard"],
    [Role.INSTITUTION_REPRESENTATIVE, "/dashboard"],
  ];

  it.each(dataSet)("Should return correct redirect link", (role: Role, link: string) => {
    const user: User = {
      uuid: "uuid2",
      email: "",
      password: "",
      role: role,
      createdAt: undefined,
      updatedAt: undefined,
      fullName: "",
      institutionUuid: "uuid-inst",
      lastLoginAt: null,
      currency: "",
      stripeCustomerId: "",
      status: UserStatus.ACTIVE,
      signatureUrl: "",
      title: "title",
      subscribedToEmails: true,
    };
    expect(routeProvider.onLogin(user)).toEqual(link);
  });

  it("Should throw error on incorrect role", () => {
    const user: User = {
      uuid: "uuid2",
      email: "",
      password: "",
      role: Role.ADMIN,
      createdAt: undefined,
      updatedAt: undefined,
      fullName: "",
      institutionUuid: "uuid-inst",
      lastLoginAt: null,
      currency: "",
      stripeCustomerId: "",
      status: UserStatus.ACTIVE,
      signatureUrl: "",
      title: "title",
      subscribedToEmails: true,
    };
    expect(() => routeProvider.onLogin(user)).toThrowError(new RoleNotFoundException(user.role));
    expect(() => routeProvider.onLogin(user)).toThrowError(`Role not found ${user.role}`);
  });
});