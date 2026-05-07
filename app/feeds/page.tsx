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

export default function FeedsPage() {
  return (
    <div className="_layout _layout_main_wrapper">
        <LayoutMood/>
        <div className="_main_layout">
          <DesktopHeader />
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
                    <Post />
                    <Post />
                    <Post />
                    <Post />
                    <Post />
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
