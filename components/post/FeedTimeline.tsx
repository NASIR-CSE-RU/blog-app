"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

import { ApiRequestError } from "@/lib/api/errors";
import { getFeedPageFromClientApi } from "@/lib/feed/client";
import type { FeedPage, FeedPagination, FeedPost } from "@/types/feed";

import Post from "./Post";

type FeedTimelineProps = {
  initialPage: FeedPage;
};

function appendPosts(previousPosts: FeedPost[], nextPosts: FeedPost[]) {
  const previousPostIds = new Set(previousPosts.map((post) => post.id));
  const nextPostsById = new Map(nextPosts.map((post) => [post.id, post]));
  const mergedPosts = previousPosts.map((post) => nextPostsById.get(post.id) ?? post);

  for (const post of nextPosts) {
    if (!previousPostIds.has(post.id)) {
      mergedPosts.push(post);
    }
  }

  return mergedPosts;
}

function mergeRefreshedFirstPage(previousPosts: FeedPost[], refreshedPosts: FeedPost[]) {
  const refreshedPostIds = new Set(refreshedPosts.map((post) => post.id));
  const remainingPosts = previousPosts.filter((post) => !refreshedPostIds.has(post.id));

  return [...refreshedPosts, ...remainingPosts];
}

function EmptyFeedState() {
  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <h4 className="_feed_inner_timeline_post_title">No posts available yet.</h4>
      </div>
    </div>
  );
}

export default function FeedTimeline({ initialPage }: FeedTimelineProps) {
  const [posts, setPosts] = useState(initialPage.posts);
  const [pagination, setPagination] = useState<FeedPagination>(initialPage.pagination);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const currentPageRef = useRef(initialPage.pagination.current_page);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const lastWindowScrollYRef = useRef(0);

  useEffect(() => {
    currentPageRef.current = pagination.current_page;
  }, [pagination.current_page]);

  useEffect(() => {
    setPagination((previousPagination) => (
      previousPagination.current_page > 1
        ? {
            ...initialPage.pagination,
            current_page: previousPagination.current_page,
            count: previousPagination.count,
            has_more_pages: previousPagination.current_page < initialPage.pagination.total_pages,
          }
        : initialPage.pagination
    ));
    setPosts((previousPosts) => (
      currentPageRef.current > 1
        ? mergeRefreshedFirstPage(previousPosts, initialPage.posts)
        : initialPage.posts
    ));
    setLoadError(null);
  }, [initialPage]);

  const loadNextPage = useEffectEvent(async () => {
    if (isLoadingMore || !pagination.has_more_pages) {
      return;
    }

    setIsLoadingMore(true);
    setLoadError(null);

    try {
      const nextPage = await getFeedPageFromClientApi(
        pagination.current_page + 1,
        pagination.per_page,
      );

      setPosts((previousPosts) => appendPosts(previousPosts, nextPage.posts));
      setPagination(nextPage.pagination);
    } catch (error) {
      setLoadError(
        error instanceof ApiRequestError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Unable to load more posts right now.",
      );
    } finally {
      setIsLoadingMore(false);
    }
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel) {
      return;
    }

    if (window.innerWidth < 992) {
      return;
    }

    const scrollContainer = document.querySelector("._layout_middle_wrap");
    const root = scrollContainer instanceof HTMLElement ? scrollContainer : null;

    if (!root || !pagination.has_more_pages) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        void loadNextPage();
      }
    }, {
      root,
      rootMargin: "600px 0px",
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [loadNextPage, pagination.has_more_pages]);

  useEffect(() => {
    if (window.innerWidth >= 992 || !pagination.has_more_pages) {
      return;
    }

    function isNearBottom() {
      return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 600;
    }

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastWindowScrollYRef.current;

      lastWindowScrollYRef.current = currentScrollY;

      if (isScrollingDown && isNearBottom()) {
        void loadNextPage();
      }
    }

    lastWindowScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadNextPage, pagination.has_more_pages]);

  if (posts.length === 0) {
    return <EmptyFeedState />;
  }

  return (
    <>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {loadError ? (
        <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
          <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
            <p className="text-danger mb-3" role="alert">{loadError}</p>
            <button type="button" className="_previous_comment_txt" onClick={() => void loadNextPage()}>
              Retry
            </button>
          </div>
        </div>
      ) : null}
      {isLoadingMore ? (
        <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
          <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
            <p className="_feed_inner_timeline_post_box_para mb-0">Loading more posts...</p>
          </div>
        </div>
      ) : null}
      {pagination.has_more_pages ? <div ref={sentinelRef} aria-hidden="true" style={{ height: "1px" }} /> : null}
      {!isLoadingMore && pagination.has_more_pages ? (
        <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
          <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
            <button type="button" className="_previous_comment_txt" onClick={() => void loadNextPage()}>
              Load more posts
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
