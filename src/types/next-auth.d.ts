export {};

declare module "next-auth" {
  interface User {
    approved?: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      approved: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    approved?: boolean;
  }
}
