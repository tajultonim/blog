import { NextPage } from "next";
import Head from "next/head";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
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
  RiFlashlightLine,
  RiImageFill,
  RiUnderline,
  RiStrikethrough,
  RiSeparator,
  RiMore2Fill,
  RiSettingsLine,
} from "react-icons/ri";
import { FC, useState, useRef, ChangeEvent, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import atomDark from "react-syntax-highlighter/dist/cjs/styles/prism/atom-dark";
import { useRouter } from "next/router";

const theme: any = atomDark;

const New: NextPage = () => {
  const [moreToolOpen, setMoreToolOpen] = useState(false);
  const [postOptionsOpen, setPostOptionsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const controller = new AbortController();
  const signal = controller.signal;
  const textareael = useRef<any>(null);
  const fileinput = useRef<any>(null);
  const router = useRouter();

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
        const url = "/api/page/image/upload";
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
            // console.log(res);
            setIsUploadingImage(false);
            if (!signal.aborted) {
              let imgurl = res.url;
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

  async function handlePublishPost() {
    try {
      setIsPublishing(true);
      let localpage = JSON.parse(localStorage.getItem("draft-page") || "{}");
      let page = {
        content: localpage.content,
        title: localpage.title,
        slug: localpage.slug,
        description: localpage.description,
      };
      let res = await fetch("/api/page/new-page", {
        method: "POST",
        body: JSON.stringify(page),
      }).then((r) => r.json());
      setIsPublishing(false);
      localStorage.setItem("draft-page", "{}");
      console.log(res);
      router.push("/admin/pages");
    } catch (error) {
      setIsPublishing(false);
      console.log(error);
    }
  }

  async function handleSaveDraft() {
    try {
      setIsSavingDraft(true);
      let localpage = JSON.parse(localStorage.getItem("draft-page") || "{}");
      let page = {
        content: localpage.content,
        title: localpage.title,
        slug: localpage.slug,
        description: localpage.description,
      };

      let res = await fetch("/api/page/new-draft", {
        method: "POST",
        body: JSON.stringify(page),
      }).then((r) => r.json());

      setIsSavingDraft(false);
      if (res.code !== 200) {
        alert("Something missing");
        return console.log(res);
      }
      localStorage.setItem("draft-page", "{}");
      router.push("/admin/pages");
    } catch (error) {
      setIsSavingDraft(false);
      console.log(error);
    }
  }

  function cancelUpload() {
    controller.abort();
    console.log(signal);
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

  useEffect(() => {
    if (localStorage) {
      let draft: any = localStorage.getItem("draft-page");
      if (draft) {
        draft = JSON.parse(draft);
        setContent(draft.content || "");
        setTitle(draft.title || "");
        setSlug(draft.slug || "");
        setDescription(draft.description || "");
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>New Page | TajulTonim</title>
      </Head>
      <DashboardLayout
        pageId="pages"
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
            <div className=" pt-2 px-10">
              <input
                onChange={(e) => {
                  localStorageUpdate("title", e.target.value);
                  setTitle(e.target.value);
                }}
                value={title}
                className=" w-full font-black pt-3 h-20 text-3xl xl:text-4xl outline-none placeholder:text-gray-600"
                placeholder="New page title here ..."
              />
            </div>

            <div className="toolbar px-10 bg-gray-50 my-2 p-1 justify-between flex w-full">
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
            <h1 className="w-full font-black pt-3 pl-0 min-h-20 text-3xl xl:text-4xl outline-none">
              {title}
            </h1>
            <p className=" text-sm mb-1">
              Last Update: {new Intl.DateTimeFormat("en-GB").format(new Date())}
            </p>
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
            className=" text-sm w-16 flex justify-center items-center disabled:pointer-events-none disabled:bg-blue-300 bg-blue-500 text-white px-3  py-[0.4rem]  hover:bg-blue-700 rounded-md"
          >
            {isPublishing ? (
              <AiOutlineLoading className=" animate-spin" />
            ) : (
              "Publish"
            )}
          </button>
          <button
            onClick={async () => {
              await handleSaveDraft();
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
            <p className=" font-semibold">Page options</p>
            <p className=" font-medium text-sm text-gray-900 mt-4">Slug</p>
            <p className=" text-xs">
              This will be the url path of the page. The URL structure will be
              something like
              <span className=" text-gray-700 italic">
                {" "}
                https://blog.tajultonim.ml/p/[slug]
              </span>
            </p>
            <input
              className=" border text-sm w-full outline-blue-500 p-1 mt-2 px-3 rounded"
              placeholder="your-page-slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
              }}
            />
            <p className=" font-medium text-sm text-gray-900 mt-4">
              Description
            </p>
            <p className=" text-xs">
              This will be the meta description of the page. In html it will
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
        </div>
      </DashboardLayout>
    </>
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

function localStorageUpdate(key: string, value: any) {
  let prev = JSON.parse(localStorage.getItem("draft-page") || "{}");
  prev[key] = value;
  prev["updatedAt"] = new Date().getTime();
  localStorage.setItem("draft-page", JSON.stringify(prev));
}

export default New;
