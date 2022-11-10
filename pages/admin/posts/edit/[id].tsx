import { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import DashboardLayout from "../../../../components/Layout/DashboardLayout";
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineLink,
  AiOutlineUnorderedList,
  AiOutlineOrderedList,
  AiOutlineLoading,
} from "react-icons/ai";
import {
  RiHeading,
  RiDoubleQuotesL,
  RiCodeFill,
  RiCodeBoxLine,
  RiCloseLine,
  RiFlashlightLine,
  RiImageFill,
  RiUnderline,
  RiStrikethrough,
  RiSeparator,
  RiMore2Fill,
  RiSettingsLine,
} from "react-icons/ri";
import {
  FC,
  useState,
  useRef,
  ChangeEvent,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import atomDark from "react-syntax-highlighter/dist/cjs/styles/prism/atom-dark";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import supabase from "../../../../supabase/init";
import Fuse from "fuse.js";

interface Post {
  id: string;
  created_at: string;
  title: string;
  description: string;
  cover: string;
  slug: string;
  content: string;
  word: number;
  author_id: string;
  edited_at: string;
  published_at: string;
  draft_slug: string;
  draft_description: string;
  draft_content: string;
  draft_title: string;
  draft_cover: string;
  ispublished: boolean;
  hasdraft: boolean;
  tags: TagType[];
}

interface TagType {
  id: string;
  title: string;
  description: string;
  cover: string;
  color: string;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const theme: any = atomDark;

const Id: NextPage<{ post: Post; alltags: TagType[] }> = ({
  post,
  alltags,
}) => {
  const [moreToolOpen, setMoreToolOpen] = useState(false);
  const [postOptionsOpen, setPostOptionsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isCoverUploading, setisCoverUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [cover, setCover] = useState("");
  const [description, setDescription] = useState("");
  const [newtagname, setNewtagname] = useState("");
  const [tags, setTags] = useState<TagType[]>(post.tags);
  const controller = new AbortController();
  const signal = controller.signal;
  const textareael = useRef<any>(null);
  const fileinput = useRef<any>(null);
  const coverinput = useRef<any>(null);
  const router = useRouter();
  const fuse = new Fuse(alltags, {
    keys: ["title"],
  });

  function handleCoverImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      let file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = async function () {
        let str = reader.result as string;
        const url = "/api/article/image/upload";
        setisCoverUploading(true);
        fetch(url, {
          method: "POST",
          body: JSON.stringify({ file: str }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(async (r) => {
            let res = await r.json();
            setisCoverUploading(false);
            if (!signal.aborted) {
              let imgurl = res.url;
              localStorageUpdate("cover", imgurl);
              setCover(imgurl);
            }
          })
          .catch((err) => {
            setisCoverUploading(false);
            console.log(err);
          });
      };
      reader.readAsDataURL(file);
    }
  }
  function handleBold() {
    insertAtCursor(textareael.current, "**", "**");
  }
  function handleItalic() {
    insertAtCursor(textareael.current, "*", "*");
  }
  function handleLink() {
    addLink(textareael.current, setContent);
  }
  function handleOrderedList() {
    insertAtCursor(textareael.current, "\n1. ", "\n");
  }
  function handleUnorderedList() {
    insertAtCursor(textareael.current, "\n- ", "\n");
  }
  function handleHeading() {
    insertAtCursor(textareael.current, "\n## ", "\n");
  }
  function handleQuote() {
    insertAtCursor(textareael.current, "\n>", "\n");
  }
  function handleCode() {
    insertAtCursor(textareael.current, "`", "`");
  }
  function handleCodeBlock() {
    insertAtCursor(textareael.current, "\n```\n", "\n```\n");
  }
  function handleEmbed() {
    insertAtCursor(textareael.current, "{% embed ", " %}");
  }
  function handleImage(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      let file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = async function () {
        let str = reader.result as string;
        const url = "/api/article/image/upload";
        setIsUploadingImage(true);
        fetch(url, {
          method: "POST",
          body: JSON.stringify({ file: str }),
          headers: {
            "Content-Type": "application/json",
          },
          signal,
        })
          .then(async (r) => {
            let res = await r.json();
            console.log(res);
            //await delay(2000);
            setIsUploadingImage(false);
            if (!signal.aborted) {
              let imgurl = res.url;
              //"https://res.cloudinary.com/dfypyjicq/image/upload/v1667659785/fgeo83hravzyafgycnd9.png";
              textareael.current.focus();
              insertAtCursor(textareael.current, "\n![", "](" + imgurl + ")\n");
            }
          })
          .catch((err) => {
            setIsUploadingImage(false);
            console.log(err);
          });
      };
      reader.readAsDataURL(file);
    }
  }

  function cancelUpload() {
    controller.abort();
  }
  function handleUnderline() {
    insertAtCursor(textareael.current, "<u>", "</u>");
    setMoreToolOpen(false);
  }
  function handleStrikethrough() {
    insertAtCursor(textareael.current, "~~", "~~");
    setMoreToolOpen(false);
  }
  function handleDivider() {
    insertAtCursor(textareael.current, "\n\n---\n", "\n");
    setMoreToolOpen(false);
  }

  async function handlePublishPost() {
    try {
      await handleSaveDraft(false);
      setIsPublishing(true);
      let res = await fetch("/api/article/publish-draft", {
        method: "POST",
        body: JSON.stringify({ id: post.id }),
      }).then((r) => r.json());
      setIsPublishing(false);
      localStorage.removeItem(post.id);
      console.log(res);
      router.reload();
    } catch (error) {
      setIsPublishing(false);
      console.log(error);
    }
  }

  async function handleSaveDraft(refresh: boolean) {
    try {
      if (JSON.stringify(post.tags) != JSON.stringify(tags)) {
        if (!confirm("Tags will be published!")) {
          return;
        }
      }
      setIsSavingDraft(true);
      let localpost = JSON.parse(localStorage.getItem(post.id) || "{}");
      let npost = {
        content: localpost.content,
        title: localpost.title,
        cover: localpost.cover,
        slug: localpost.slug,
        id: post.id,
        tags: tags.map((t) => t.id),
        description: localpost.description || localpost.content.slice(0, 200),
      };
      let res = await fetch("/api/article/save-draft", {
        method: "PATCH",
        body: JSON.stringify(npost),
      }).then((r) => r.json());
      setIsSavingDraft(false);
      localStorage.setItem(post.id, JSON.stringify(res.data));
      if (refresh) {
        router.reload();
      }
    } catch (error) {
      setIsSavingDraft(false);
      console.log(error);
    }
  }

  async function handleRevert() {
    try {
      let res = await fetch("/api/article/revert", {
        method: "PATCH",
        body: JSON.stringify({ id: post.id }),
      }).then((r) => r.json());

      localStorage.setItem(
        res.data[0].id,
        JSON.stringify({
          content: res.data[0].content,
          title: res.data[0].title,
          tags: res.data[0].tags,
          cover: res.data[0].cover,
          slug: res.data[0].slug,
          description: res.data[0].description,
        })
      );
      setContent(res.data[0].content);
      setTitle(res.data[0].title);
      setSlug(res.data[0].slug);
      setCover(res.data[0].cover);
      setDescription(res.data[0].description);
      setTags(res.data[0].tags);
    } catch (error) {
      console.log(error);
      router.reload();
    }
  }

  async function handleUnpublish() {
    try {
      setIsUnpublishing(true);
      let res = await fetch("/api/article/unpublish", {
        method: "POST",
        body: JSON.stringify({ id: post.id, slug: post.slug }),
      }).then((r) => r.json());
      setIsUnpublishing(false);
      localStorage.removeItem(post.id);
      console.log(res);
      router.reload();
    } catch (error) {
      setIsUnpublishing(false);
      console.log(error);
    }
  }

  async function handleDelete() {
    try {
      setIsDeleting(true);
      let res = await fetch("/api/article/delete", {
        method: "DELETE",
        body: JSON.stringify({ id: post.id, slug: post.slug }),
      }).then((r) => r.json());
      setIsDeleting(false);
      localStorage.removeItem(post.id);
      console.log(res);
      router.reload();
    } catch (error) {
      setIsDeleting(false);
      console.log(error);
    }
  }

  useEffect(() => {
    if (localStorage) {
      try {
        let draft = JSON.parse(localStorage.getItem(post.id) || "{}");
        if (
          !draft.content ||
          !draft.title ||
          !draft.slug ||
          !draft.cover ||
          !draft.description ||
          !draft.tags
        ) {
          throw new Error();
        }
        setContent(draft.content);
        setTitle(draft.title);
        setSlug(draft.slug);
        setCover(draft.cover);
        setDescription(draft.description);
        setTags(draft.tags);
      } catch (error) {
        let dpost = post.hasdraft
          ? {
              id: post.id,
              content: post.draft_content,
              title: post.draft_title,
              cover: post.draft_cover,
              slug: post.draft_slug,
              description: post.draft_description,
            }
          : {
              id: post.id,
              content: post.content,
              title: post.title,
              cover: post.cover,
              slug: post.slug,
              description: post.description,
            };
        localStorage.setItem(
          post.id,
          JSON.stringify({
            content: dpost.content,
            title: dpost.title,
            cover: dpost.cover,
            tags: post.tags,
            slug: dpost.slug,
            id: dpost.id,
            description: dpost.description,
          })
        );
        setContent(dpost.content);
        setTitle(dpost.title);
        setSlug(dpost.slug);
        setCover(dpost.cover);
        setDescription(dpost.description);
      }
    }
  }, [
    post.content,
    post.cover,
    post.description,
    post.draft_content,
    post.draft_cover,
    post.draft_description,
    post.draft_slug,
    post.draft_title,
    post.hasdraft,
    post.id,
    post.slug,
    post.title,
    post.tags,
  ]);
  function localStorageUpdate(key: string, value: any) {
    let prev = JSON.parse(localStorage.getItem(post.id) || "{}");
    prev[key] = value;
    prev["updatedAt"] = new Date().getTime();
    localStorage.setItem(post.id, JSON.stringify(prev));
  }
  return (
    <>
      <Head>
        <title>{`Edit: ${post.title} | TajulTonim`}</title>
      </Head>
      <DashboardLayout
        pageId="posts"
        Header={() => {
          return (
            <div className=" flex w-full justify-between">
              <button
                onClick={() => {
                  if (confirm("Are you sure?")) {
                    router.push("/admin/posts");
                  }
                }}
                className={` px-3 py-[0.4rem] hover:bg-blue-100 w-16 rounded-md hover:text-blue-700 `}
              >
                Cancel
              </button>
              <div className=" flex flex-1 justify-end">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    textareael.current.focus();
                  }}
                  className={` px-3 py-[0.4rem] hover:bg-blue-100 w-16 rounded-md hover:text-blue-700 ${
                    isEditing ? " font-semibold" : ""
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                  }}
                  className={` w-20 px-3 py-[0.4rem] hover:bg-blue-100 rounded-md hover:text-blue-700 ${
                    !isEditing ? " font-semibold" : ""
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>
          );
        }}
      >
        <div className=" bg-white rounded-lg mt-6 mb-4 flex-1 flex flex-col overflow-hidden">
          <div className={`flex-1 ${isEditing ? "flex" : "hidden"} flex-col`}>
            <div className=" px-10 mt-10">
              {!isCoverUploading && !cover ? (
                <button
                  className=" border-2 rounded p-1 px-2"
                  onClick={() => {
                    coverinput.current.click();
                  }}
                >
                  Add a cover image
                </button>
              ) : cover ? (
                <div className=" flex items-center gap-5">
                  <div className=" relative w-1/4 aspect-video rounded">
                    <Image
                      alt=""
                      className="rounded"
                      src={cover}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <div className=" gap-2 flex">
                    <button
                      onClick={() => {
                        coverinput.current.click();
                      }}
                      className=" border-2 hover:bg-blue-100 rounded p-1 px-2"
                    >
                      Change
                    </button>
                    <button
                      className=" text-red-500 hover:bg-blue-50 rounded p-1 px-2"
                      onClick={() => {
                        setCover("");
                        localStorageUpdate("cover", "");
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className=" flex gap-2 items-center">
                  <AiOutlineLoading className=" animate-spin text-blue-500" />
                  <p className=" text-b"> Uploading image...</p>{" "}
                </div>
              )}
              <input
                ref={coverinput}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleCoverImageChange}
              />
            </div>

            <div className=" p-2 px-10">
              <input
                onChange={(e) => {
                  localStorageUpdate("title", e.target.value);
                  setTitle(e.target.value);
                }}
                value={title}
                className=" w-full font-black p-3 h-20 text-3xl xl:text-4xl outline-none placeholder:text-gray-600"
                placeholder="New post title here ..."
              />
            </div>

            <div className=" flex w-full px-10 items-center relative">
              {tags.map((t) => (
                <Tag
                  key={t.id}
                  setTags={(id: string) => {
                    setTags((prev) => {
                      localStorageUpdate(
                        "tags",
                        prev.filter((t) => t.id !== id)
                      );
                      return prev.filter((t) => t.id !== id);
                    });
                  }}
                  tag={t}
                ></Tag>
              ))}
              <div className=" -mt-5 rounded-lg items-center flex text-sm pr-1 py-[2px] pl-2 mr-2 ">
                <input
                  value={newtagname}
                  disabled={tags.length >= 4}
                  onChange={(e) => {
                    setNewtagname(e.target.value);
                  }}
                  onFocus={() => {
                    setIsSuggestionOpen(true);
                  }}
                  onBlur={(e) => {
                    setTimeout(function () {
                      setIsSuggestionOpen(false);
                    }, 500);
                  }}
                  className="outline-none"
                  placeholder={tags.length >= 4 ? "" : "Add another"}
                />
              </div>

              <div
                className={`absolute z-50 bg-white border rounded p-3 top-2 ${
                  isSuggestionOpen ? "" : " invisible"
                }`}
              >
                <div className="">
                  {(fuse
                    .search(newtagname)
                    .map((ts) => ts.item)
                    .filter((at) => {
                      let said = tags.map((t) => t.id);
                      return !said.includes(at.id);
                    }).length
                    ? fuse
                        .search(newtagname)
                        .map((ts) => ts.item)
                        .filter((at) => {
                          let said = tags.map((t) => t.id);
                          return !said.includes(at.id);
                        })
                    : alltags.filter((at) => {
                        let said = tags.map((t) => t.id);
                        return !said.includes(at.id);
                      })
                  ).map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setTags((prevs) => {
                          localStorageUpdate("tags", [...prevs, t]);
                          return [...prevs, t];
                        });
                      }}
                      className=" py-2 w-full max-w-sm group cursor-pointer"
                    >
                      <div className=" group-hover:text-blue-500">
                        <span className={`mr-1`} style={{ color: t.color }}>
                          #
                        </span>
                        {t.title}
                      </div>
                      <div className="">{t.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="toolbar px-10 bg-gray-50 my-3 p-1 justify-between flex w-full">
              <div className="flex  gap-2 ">
                <Toolbar Icon={AiOutlineBold} fun={handleBold} tip="Bold" />
                <Toolbar
                  Icon={AiOutlineItalic}
                  fun={handleItalic}
                  tip="Italic"
                />
                <Toolbar Icon={AiOutlineLink} fun={handleLink} tip="Link" />
                <Toolbar
                  Icon={AiOutlineOrderedList}
                  fun={handleOrderedList}
                  tip="Ordered list"
                />
                <Toolbar
                  Icon={AiOutlineUnorderedList}
                  fun={handleUnorderedList}
                  tip="Unordered list"
                />
                <Toolbar Icon={RiHeading} fun={handleHeading} tip="Heading" />
                <Toolbar Icon={RiDoubleQuotesL} fun={handleQuote} tip="Quote" />
                <Toolbar Icon={RiCodeFill} fun={handleCode} tip="Code" />
                <Toolbar
                  Icon={RiCodeBoxLine}
                  fun={handleCodeBlock}
                  tip="Code block"
                />
                <Toolbar
                  Icon={RiFlashlightLine}
                  fun={handleEmbed}
                  tip="Embed"
                />

                <Toolbar
                  Icon={RiImageFill}
                  loading={isUploadingImage}
                  fun={() => {
                    fileinput.current.click();
                  }}
                  loadingClickHandler={cancelUpload}
                  tip="Upload image"
                />
                <input
                  onChange={async (e) => {
                    await handleImage(e);
                  }}
                  className="hidden"
                  type="file"
                  ref={fileinput}
                />
              </div>
              <div className=" flex flex-col items-end relative">
                <Toolbar
                  Icon={RiMore2Fill}
                  fun={() => {
                    setMoreToolOpen(!moreToolOpen);
                  }}
                  tip=""
                />
                <div
                  className={` bg-white flex gap-2 z-10 absolute -bottom-12 -right-1 p-1 border rounded scale-0 duration-100 origin-top-right ${
                    moreToolOpen ? " scale-100" : ""
                  }`}
                >
                  <Toolbar
                    Icon={RiUnderline}
                    fun={handleUnderline}
                    tip="Underline"
                  />
                  <Toolbar
                    Icon={RiStrikethrough}
                    fun={handleStrikethrough}
                    tip="Strikethrough"
                  />
                  <Toolbar
                    Icon={RiSeparator}
                    fun={handleDivider}
                    tip="Line divider"
                  />
                </div>
              </div>
            </div>
            <div className=" flex-1 px-10 relative">
              <div
                className={`overlay absolute flex-1 h-full w-full ${
                  isUploadingImage
                    ? "pointer-events-auto"
                    : "pointer-events-none"
                }`}
              />
              <textarea
                ref={textareael}
                onChange={(e) => {
                  localStorageUpdate("content", e.target.value);
                  setContent(e.target.value);
                }}
                value={content}
                spellCheck={true}
                className=" scrollbar scrollbar-track-gray-50 scrollbar-w-thin scrollbar-thumb-gray-300 w-full h-full outline-none p-2 resize-none"
              />
            </div>
          </div>

          <div
            className={` scrollbar scrollbar-track-gray-50 scrollbar-w-thin scrollbar-thumb-gray-300  px-10 py-2 flex-1 ${
              isEditing ? "hidden" : "flex"
            }  flex-col overflow-y-scroll`}
          >
            {cover && (
              <div className="relative w-full min-w-full aspect-video bg-black mt-10 rounded-t-lg">
                <Image
                  alt=""
                  src={cover}
                  className=" rounded-t-lg"
                  objectFit="cover"
                  layout="fill"
                />
              </div>
            )}
            <h1 className="w-full font-black p-3 pl-0 min-h-20 text-3xl xl:text-4xl outline-none">
              {title}
            </h1>
            <div className="flex -mt-2 ">
              {tags.map((t) => (
                <div
                  key={t.id}
                  className=" hover:bg-blue-100 rounded px-2 cursor-pointer"
                >
                  <span style={{ color: t.color }}>#</span>
                  {t.title}
                </div>
              ))}
            </div>
            <div className="preview flex-1 mt-2">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        language={match[1]}
                        style={theme}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  table(props) {
                    return (
                      <div className=" my-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-md rounded">
                        <table>{props.children}</table>
                      </div>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
        <div className=" flex gap-2 mb-2 relative">
          <button
            onClick={async () => {
              await handlePublishPost();
            }}
            disabled={isPublishing}
            className=" text-sm w-20 flex justify-center items-center disabled:hover:bg-blue-300 disabled:bg-blue-300 bg-blue-500 text-white px-3  py-[0.4rem]  hover:bg-blue-700 rounded-md"
          >
            {isPublishing ? (
              <AiOutlineLoading className=" animate-spin" />
            ) : (
              "Publish"
            )}
          </button>
          <button
            onClick={async () => {
              await handleSaveDraft(true);
            }}
            disabled={isSavingDraft}
            className=" disabled:text-gray-600 w-24 flex justify-center items-center disabled:pointer-events-none text-sm px-3  py-[0.4rem] hover:bg-blue-100 rounded-md hover:text-blue-700"
          >
            {isSavingDraft ? (
              <AiOutlineLoading className=" animate-spin" />
            ) : (
              "Save draft"
            )}
          </button>
          <Toolbar
            Icon={RiSettingsLine}
            fun={() => {
              setPostOptionsOpen((prev) => !prev);
            }}
            tip=""
          />

          <div
            className={` bg-white p-2 z-10 rounded border absolute bottom-9 left-52 shadow-xl w-full max-w-[20rem] ${
              postOptionsOpen ? "scale-100" : "scale-0"
            }`}
          >
            <p className=" font-semibold">Post options</p>
            <p className=" font-medium text-sm text-gray-900 mt-4">Slug</p>
            <p className=" text-xs">
              This will be the url path of the post. The URL structure will be
              something like
              <span className=" text-gray-700 italic">
                {" "}
                https://blog.tajultonim.ml/[slug]
              </span>
            </p>
            <input
              className=" border text-sm w-full outline-blue-500 p-1 mt-2 px-3 rounded"
              placeholder="your-post-slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
              }}
            />
            <p className=" font-medium text-sm text-gray-900 mt-4">
              Description
            </p>
            <p className=" text-xs">
              This will be the meta description of the post. In html it will
              render something like
              <span className=" text-gray-700 italic">
                {` <meta name="description" content="YOUR_DESCRIPTION" />`}
              </span>
            </p>
            <input
              className=" border text-sm w-full outline-blue-500 p-1 mt-2 px-3 rounded"
              placeholder="Your post description here"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            <button
              onClick={() => {
                localStorageUpdate("slug", slug);
                localStorageUpdate("description", description);
                setPostOptionsOpen(false);
              }}
              className=" w-full mt-3 rounded bg-blue-100 hover:bg-blue-500 hover:text-white text-blue-600 py-1 px-2"
            >
              Done
            </button>
          </div>

          <button
            onClick={handleRevert}
            className=" text-sm px-3  py-[0.4rem] hover:bg-blue-100 rounded-md hover:text-blue-700"
          >
            Revert to published
          </button>

          <button
            onClick={async () => {
              await handleUnpublish();
            }}
            disabled={isUnpublishing}
            className="   border-orange-600 text-orange-600 hover:text-white px-3 hover:bg-orange-600  active:bg-orange-500 disabled:text-white disabled:bg-orange-400 disabled:border-orange-400 disabled:pointer-events-none py-[0.4rem] border-2 rounded-md text-sm w-20  flex justify-center items-center"
          >
            {isUnpublishing ? (
              <AiOutlineLoading className=" animate-spin" />
            ) : (
              "Unpublish"
            )}
          </button>

          <button
            onClick={async () => {
              await handleDelete();
            }}
            disabled={isDeleting}
            className="   border-red-600 text-red-600 hover:text-white px-3 hover:bg-red-600  active:bg-red-500 disabled:text-white disabled:bg-red-400 disabled:border-red-400 disabled:pointer-events-none py-[0.4rem] border-2 rounded-md text-sm w-20  flex justify-center items-center"
          >
            {isDeleting ? (
              <AiOutlineLoading className=" animate-spin" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </DashboardLayout>
    </>
  );
};

const Tag: FC<{
  tag: TagType;
  setTags: any;
}> = ({ tag, setTags }) => {
  return (
    <div className=" -mt-5 rounded-lg items-center flex text-sm pr-1 py-[2px] pl-2 mr-2  bg-blue-100">
      <span style={{ color: tag.color }}>#</span> {tag.title}
      <span
        onClick={() => {
          setTags(tag.id);
        }}
        className=" ml-[2px] text-gray-400 hover:text-black cursor-pointer"
      >
        <RiCloseLine />
      </span>
    </div>
  );
};

const Toolbar: FC<{
  Icon: any;
  fun: any;
  tip: string;
  loading?: boolean;
  loadingClickHandler?: any;
}> = ({ Icon, fun, tip, loading, loadingClickHandler }) => {
  return (
    <>
      <div className=" group relative flex items-center flex-col">
        <div
          className=" hover:bg-blue-50 hover:text-blue-400 p-2 rounded-lg cursor-pointer "
          onClick={!loading ? fun : loadingClickHandler}
        >
          {!loading ? (
            <Icon className=" h-5 w-5" />
          ) : (
            <AiOutlineLoading className=" h-5 w-5 animate-spin" />
          )}
        </div>

        {tip && (
          <div className=" text-xs pointer-events-none z-10 whitespace-nowrap opacity-0 absolute duration-200 bg-gray-700 text-gray-200 rounded px-2 py-1 -bottom-3 group-hover:-bottom-8 group-hover:opacity-100">
            {tip}
          </div>
        )}
      </div>
    </>
  );
};

function insertAtCursor(
  textarea: HTMLTextAreaElement,
  valueBefore: string,
  valueAfter: string
) {
  let initbeforetext = textarea.value.slice(0, textarea.selectionStart);

  if (!initbeforetext.length) {
    valueBefore = valueBefore.trimStart();
  }
  textarea.focus();
  let selectionText = textarea.value.slice(
    textarea.selectionStart,
    textarea.selectionEnd
  );

  document.execCommand(
    "insertText",
    false,
    valueBefore + selectionText + valueAfter
  );

  textarea.setSelectionRange(
    (initbeforetext + valueBefore).length,
    (initbeforetext + valueBefore + selectionText).length
  );
}

function addLink(textarea: HTMLTextAreaElement, setContent: any) {
  let initbeforetext = textarea.value.slice(0, textarea.selectionStart);

  textarea.focus();
  let selectionText = textarea.value.slice(
    textarea.selectionStart,
    textarea.selectionEnd
  );

  document.execCommand("insertText", false, "[" + selectionText + "](url)");

  textarea.setSelectionRange(
    (initbeforetext + "[" + selectionText + "](").length,
    (initbeforetext + "[" + selectionText + "](url").length
  );
  textarea.focus();
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let { data, error } = await supabase
    .from("posts")
    .select("*,tags(title,description,color,id)")
    .eq("id", context.params?.id);
  let tagsres = await supabase.from("tags").select("*");
  let tags = tagsres.data;

  if (!data?.length) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post: data[0],
      alltags: tags,
    },
  };
};

export default Id;
