import { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/legacy/image";
import DashboardLayout from "../../../components/Layout/DashboardLayout";
import supabase from "../../../supabase/init";
import { AiOutlineLoading } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import Link from "next/link";
import { ChangeEvent, useRef, useState, useEffect } from "react";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

interface TagType {
  id: string;
  title: string;
  description: string;
  cover: string;
  color: string;
}

const CreateTag: NextPage = () => {
  const fileinputref = useRef<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState("");
  const [color, setColor] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      let file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = async function () {
        let str = reader.result as string;
        const url = "/api/tag/cover/upload";
        setIsUploadingImage(true);
        fetch(url, {
          method: "POST",
          body: JSON.stringify({ file: str }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then(async (r) => {
            let res = await r.json();
            console.log(res);
            setIsUploadingImage(false);
            setCover(res.url);
            localStorageUpdate("cover", res.url);
          })
          .catch((err) => {
            setIsUploadingImage(false);
            console.log(err);
          });
      };
      reader.readAsDataURL(file);
    }
  }

  async function createTag() {
    if (title || description || cover || color) {
      let tag = {
        title,
        description,
        cover,
        color,
      };
      setIsCreating(true);
      console.log(tag);
      setIsCreating(false);
      let res = await fetch("/api/tag/new", {
        method: "POST",
        body: JSON.stringify(tag),
      }).then((res) => res.json());
      if (res.code == 200) {
        localStorage.setItem("draft-tag","{}")
        router.push("/admin/tags");
      } else {
        alert("Something went wrong!");
      }
    } else {
      alert("Something went wrong!");
    }
  }

  useEffect(() => {
    if (localStorage) {
      let draft = JSON.parse(localStorage.getItem("draft-tag") || "{}");
      setTitle(draft.title || "");
      setDescription(draft.description || "");
      setCover(draft.cover || "");
      setColor(draft.color || "");
    }
  }, []);
  return (
    <DashboardLayout pageId="tags">
      <div className=" p-6 px-10 bg-white flex-1 rounded-lg mt-6">
        <div className=" w-full flex justify-end">
          <button
            onClick={() => {
              if (confirm("Are you sure?")) {
                router.push("/admin/tags");
              }
            }}
            className=" my-3 mt-5 text-black bg-gray-100 mr-3 rounded p-2 py-1 hover:bg-red-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              await createTag();
            }}
            className=" my-3 mt-5 text-white rounded flex items-center bg-blue-500 p-2 py-1 hover:bg-blue-400"
          >
            {isCreating ? (
              <>
                <AiOutlineLoading className=" animate-spin mr-2" />
                Creating
              </>
            ) : (
              "Create"
            )}
          </button>
        </div>
        <p className=" font-semibold text-gray-700">Title</p>
        <input
          className=" ml-3 bg-gray-100 w-3/4 rounded outline-blue-500 px-3 py-1 mt-2"
          placeholder="Tag Name"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            localStorageUpdate("title", e.target.value);
          }}
        />
        <p className=" font-semibold text-gray-700 mt-3">Description</p>
        <input
          className=" ml-3 bg-gray-100 w-3/4 rounded outline-blue-500 px-3 py-1 mt-2"
          placeholder="Tag Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            localStorageUpdate("description", e.target.value);
          }}
        />
        <p className=" font-semibold text-gray-700 mt-3">Color</p>
        <div className=" flex  py-1 mt-2">
          <input
            value={color}
            placeholder="#000000"
            onChange={(e) => {
              setColor(e.target.value);
              localStorageUpdate("color", e.target.value);
            }}
            className={
              "w-1/2 max-w-[7rem] ml-3 z-10 bg-gray-100 rounded-l outline-blue-500 px-3"
            }
          />
          <input
            className=" rounded-r px-1 bg-gray-100"
            placeholder="Tag Description"
            type={"color"}
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              localStorageUpdate("color", e.target.value);
            }}
          />
        </div>
        <p className=" font-semibold text-gray-700 mt-3">Cover</p>
        <div className=" flex mt-2 items-center ml-3">
          {cover && (
            <div className="relative h-10 w-10 ">
              <Image alt="" objectFit="contain" layout="fill" src={cover} />
            </div>
          )}
          <button
            onClick={() => {
              fileinputref.current.click();
            }}
            disabled={isUploadingImage}
            className={` h-9 flex justify-center items-center disabled:pointer-events-none  ml-3  hover:text-white hover:border-transparent ${
              cover
                ? "border-orange-500 disabled:bg-orange-100 disabled:border-transparent text-orange-500 hover:bg-orange-500"
                : "w-3/4 border-gray-500 text-gray-500 hover:bg-blue-500"
            } rounded outline-blue-500 cursor-pointer px-3 border-2 py-1  text-center`}
          >
            {isUploadingImage ? (
              <>
                <AiOutlineLoading className=" animate-spin mr-2" />
                Uploading Image
              </>
            ) : cover ? (
              "Change"
            ) : (
              "Upload a file"
            )}
          </button>
          {cover && (
            <button
              onClick={() => {
                setCover("");
                localStorageUpdate("cover", "");
              }}
              className={` h-9 ml-3  hover:text-white hover:border-transparent ${
                cover
                  ? "border-red-500 text-red-500 hover:bg-red-500"
                  : "w-3/4 border-gray-500 text-gray-500 hover:bg-blue-500"
              } rounded outline-blue-500 cursor-pointer px-3 border-2 py-1  text-center`}
            >
              Remove
            </button>
          )}
        </div>

        <input
          className=" hidden "
          ref={fileinputref}
          type="file"
          accept="image/*"
          onChange={async (e) => {
            await handleImageChange(e);
          }}
        ></input>
      </div>
    </DashboardLayout>
  );
};

function localStorageUpdate(key: string, value: string) {
  let prev = JSON.parse(localStorage.getItem("draft-tag") || "{}");
  prev[key] = value;
  prev["updatedAt"] = new Date().getTime();
  localStorage.setItem("draft-tag", JSON.stringify(prev));
}

export default CreateTag;
