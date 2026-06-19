import createMiddleware from "next-intl/middleware";
import { routing } from "./src/framework/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(es|en)/:path*"]
};
