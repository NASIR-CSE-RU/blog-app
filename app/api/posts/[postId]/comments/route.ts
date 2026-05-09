import {
  forwardAuthenticatedApiRoute,
  invalidRouteParam,
} from "@/lib/api/route";

type RouteContext = {
  params: Promise<{
    postId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { postId: postIdParam } = await context.params;
  const postId = Number(postIdParam);

  if (!Number.isInteger(postId) || postId <= 0) {
    return invalidRouteParam("Invalid post id");
  }

  return forwardAuthenticatedApiRoute(`/posts/${postId}/comments`, {
    fallbackErrorMessage: "Unable to load comments right now.",
  });
}
