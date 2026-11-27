"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Flag, Loader2, Trash2 } from "lucide-react";
import { askAndReport } from "@/components/community/report";
import { Avatar } from "@/components/ui/Avatar";
import { communityApi } from "@/lib/api/community";
import type { CommunityAuthor, CommunityPost, PostComment } from "@/lib/types/community";
import { errorMessage } from "@/lib/utils";
import { BoardCard, type BoardHandlers } from "./BoardCard";
import { ago, fullDate } from "./feedUtils";
import { MentionBox, splitMentions } from "./MentionBox";

/** A post on its own with its replies and a reply box (opened from the feed or a ?post= link). */
export function PostThread({
  postId,
  initial,
  h,
  me,
  onBack,
}: {
  postId: string;
  initial?: CommunityPost;
  h: BoardHandlers;
  me: { id: string | null; name: string; avatar?: string | null };
  onBack: () => void;
}) {
  // from the feed we get the post (kept current by the page); from a shared link we fetch it
  const [fetched, setFetched] = useState<CommunityPost | null>(null);
  const post = initial ?? fetched;
  const [missing, setMissing] = useState(false);
  const [replies, setReplies] = useState<PostComment[] | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picked, setPicked] = useState<CommunityAuthor[]>([]); // people chosen with @ in the reply box

  useEffect(() => {
    let live = true;
    if (!initial)
      communityApi
        .getPost(postId)
        .then((p) => live && setFetched(p))
        .catch(() => live && setMissing(true));
    communityApi
      .getComments(postId)
      .then((r) => live && setReplies(r))
      .catch(() => live && setReplies([]));
    window.scrollTo({ top: 0 });
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per post
  }, [postId]);

  // everyone in the thread: suggested first in the @ picker, and their @names show as links in replies
  const people: CommunityAuthor[] = [];
  for (const a of [post?.author, ...(replies ?? []).map((r) => r.author), ...picked])
    if (a && !people.some((p) => p.id === a.id)) people.push(a);

  const update = (p: CommunityPost) => {
    setFetched(p);
    h.onChange(p);
  };

  const reply = async () => {
    if (!post || !text.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const content = text.trim();
      // only people whose "@Name" is still in the text (the server checks this too)
      const mention_ids = picked.filter((p) => content.toLowerCase().includes(`@${p.full_name.toLowerCase()}`)).map((p) => p.id);
      const c = await communityApi.createComment(post.id, { content, mention_ids });
      setReplies((r) => [...(r ?? []), c]);
      setText("");
      update({ ...post, comment_count: post.comment_count + 1 });
    } catch (e) {
      setError(errorMessage(e) || "Couldn't reply. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const removeReply = async (c: PostComment) => {
    if (!post || !confirm("Delete this reply?")) return;
    try {
      await communityApi.deleteComment(c.id);
      setReplies((r) => (r ?? []).filter((x) => x.id !== c.id));
      update({ ...post, comment_count: Math.max(0, post.comment_count - 1) });
    } catch {
      alert("Couldn't delete the reply.");
    }
  };

  return (
    <div>
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b-[1.5px] border-hair bg-paper/90 px-3 py-2.5 backdrop-blur max-md:top-14">
        <button type="button" onClick={onBack} aria-label="Back to the board" className="grid size-9 place-items-center rounded-full hover:bg-ink/[0.06]">
          <ArrowLeft className="size-5" />
        </button>
        <h2 className="text-[16px] font-semibold">Discussion</h2>
      </div>

      {missing ? (
        <p className="px-5 py-16 text-center text-[15px] text-body">This post was deleted or isn&apos;t available.</p>
      ) : !post ? (
        <p className="flex items-center justify-center gap-2 py-16 text-[14px] text-mute">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </p>
      ) : (
        <>
          <div className="p-3 md:p-4">
            <BoardCard post={post} h={{ ...h, onChange: update, onDelete: (id) => { h.onDelete(id); onBack(); } }} full />
          </div>

          {/* reply box */}
          {h.signedIn ? (
            <div className="flex gap-3 border-y-[1.5px] border-hair px-4 py-3 md:px-5">
              <Avatar src={me.avatar} name={me.name} className="size-9 text-[12px]" />
              <div className="min-w-0 flex-1">
                <MentionBox
                  value={text}
                  onChange={setText}
                  onSubmit={reply}
                  onPick={(who) => setPicked((l) => (l.some((p) => p.id === who.id) ? l : [...l, who]))}
                  people={people}
                  meId={me.id}
                  placeholder={`Reply to ${post.author?.full_name || "this learner"}… (type @ to mention)`}
                  label="Write a reply"
                />
                {error && <p role="alert" className="mt-1 text-[13px] text-danger">{error}</p>}
              </div>
              <button
                type="button"
                onClick={reply}
                disabled={!text.trim() || busy}
                className="self-end rounded-full bg-ink px-4 py-1.5 text-[13.5px] font-semibold text-paper hover:bg-ink/85 disabled:opacity-40"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : "Reply"}
              </button>
            </div>
          ) : (
            <p className="border-y-[1.5px] border-hair px-5 py-3 text-[14px] text-body">Sign in to reply.</p>
          )}

          {/* replies */}
          {replies === null ? (
            <p className="flex items-center justify-center gap-2 py-10 text-[14px] text-mute">
              <Loader2 className="size-4 animate-spin" /> Loading replies…
            </p>
          ) : replies.length === 0 ? (
            <p className="py-10 text-center text-[14px] text-mute">No replies yet. Start the conversation.</p>
          ) : (
            <ul>
              {replies.map((c) => {
                const name = c.author?.full_name || "StudyHub Learner";
                return (
                  <li key={c.id} className="group flex gap-3 border-b-[1.5px] border-hair px-4 py-3.5 md:px-5">
                    <button type="button" onClick={() => h.onUser(c.user_id)} aria-label={`${name}'s posts`} className="self-start rounded-full">
                      <Avatar src={c.author?.avatar_url} name={name} className="size-9 text-[12px]" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <button type="button" onClick={() => h.onUser(c.user_id)} className="truncate text-[14.5px] font-semibold hover:underline">
                          {name}
                        </button>
                        <time dateTime={c.created_at} title={fullDate(c.created_at)} className="text-[13px] text-mute">
                          {ago(c.created_at)}
                        </time>
                        {c.user_id !== me.id && (
                          <button
                            type="button"
                            onClick={() => void askAndReport("comment", c.id)}
                            aria-label="Report reply"
                            title="Report reply"
                            className="ml-auto grid size-7 place-items-center rounded-full text-mute opacity-0 hover:bg-ink/[0.06] hover:text-ink focus-visible:opacity-100 group-hover:opacity-100 max-md:opacity-100"
                          >
                            <Flag className="size-3.5" />
                          </button>
                        )}
                        {c.user_id === me.id && (
                          <button
                            type="button"
                            onClick={() => removeReply(c)}
                            aria-label="Delete reply"
                            className="ml-auto grid size-7 place-items-center rounded-full text-mute opacity-0 hover:bg-danger/10 hover:text-danger focus-visible:opacity-100 group-hover:opacity-100 max-md:opacity-100"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="mt-0.5 whitespace-pre-wrap break-words text-[15px] leading-[1.5] text-ink">
                        {splitMentions(c.content, people).map((part, i) =>
                          part.who ? (
                            <button key={i} type="button" onClick={() => h.onUser(part.who!.id)} className="font-semibold text-accent-ink hover:underline">
                              {part.text}
                            </button>
                          ) : (
                            <span key={i}>{part.text}</span>
                          )
                        )}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
