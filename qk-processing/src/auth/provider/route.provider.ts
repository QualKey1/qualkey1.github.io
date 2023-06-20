import { User } from "@prisma/client";

import { RoleNotFoundException } from "../exception";

const routeMapping = new Map([
  ["STUDENT", "/dashboard"],
  ["INSTITUTION_REPRESENTATIVE", "/dashboard"],
]);

/**
 * Helper class which provides Route depending on the Role of the User
 */
export class RouteProvider {
    
  onLogin(user: User):string {
    if (routeMapping.has(user.role)) return routeMapping.get(user.role);

    throw new RoleNotFoundException(user.role);
  }
}