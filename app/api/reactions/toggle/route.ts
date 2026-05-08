import { forwardAuthenticatedApiRoute } from "@/lib/api/route";

export async function POST(request: Request) {
  const body = await request.text();

  return forwardAuthenticatedApiRoute("/reactions/toggle", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
    },
    fallbackErrorMessage: "Unable to update your like right now.",
  });
}
