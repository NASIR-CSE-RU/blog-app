import { forwardAuthenticatedApiRoute } from "@/lib/api/route";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const perPage = searchParams.get("per_page");
  const query = new URLSearchParams();

  if (page) {
    query.set("page", page);
  }

  if (perPage) {
    query.set("per_page", perPage);
  }

  const path = query.size > 0 ? `/feeds?${query.toString()}` : "/feeds";

  return forwardAuthenticatedApiRoute(path, {
    fallbackErrorMessage: "Unable to load the feed right now.",
  });
}
