import {
  DesktopHeader,
  LayoutMood,
  MobileHeader,
  MobileNavbar,
} from "@/components/common"
import { CreatePost } from "@/components/create-post"
import { Events, Explore, Suggest } from "@/components/left-sidebar"
import { Post } from "@/components/post"
import { Friends, Suggestion } from "@/components/right-sidebar"
import { StoryFeedDesktop, StoryFeedMobile } from "@/components/story-feed"
import { getFeedFromApi } from "@/lib/feed/api"
import { requireAuthSession } from "@/lib/auth/user"
import type { FeedPost } from "@/types/feed"

export default async function FeedsPage() {
  const { user } = await requireAuthSession()

  let posts: FeedPost[] = []

  posts = await getFeedFromApi()

  const userName = `${user.first_name} ${user.last_name}`.trim()

  return (
    <div className="_layout _layout_main_wrapper">
        <LayoutMood/>
        <div className="_main_layout">
          <DesktopHeader userName={userName} />
        <MobileHeader />
          <MobileNavbar />
          <div className="container _custom_container">
            <div className="_layout_inner_wrap">
              <div className="row">
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                  <div className="_layout_left_sidebar_wrap">
                    <Explore />
                    <Suggest />
                    <Events />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                  <div className="_layout_middle_wrap">
                    <div className="_layout_middle_inner">
                      <StoryFeedDesktop />
                      <StoryFeedMobile />
                    <CreatePost />
                    {posts.length ? posts.map((post) => (
                      <Post key={post.id} post={post} />
                    )) : (
                      <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
                        <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
                          <h4 className="_feed_inner_timeline_post_title">No posts available yet.</h4>
                        </div>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                  <div className="_layout_right_sidebar_wrap">
                    <Suggestion />
                    <Friends />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
