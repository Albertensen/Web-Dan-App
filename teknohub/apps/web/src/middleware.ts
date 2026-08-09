export { default } from "next-auth/middleware";

/** Route yang butuh login */
export const config = {
  matcher: ["/cart/:path*", "/checkout/:path*", "/profile/:path*", "/orders/:path*"],
};
