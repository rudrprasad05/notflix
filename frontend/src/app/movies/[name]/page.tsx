"use client";

import React, { useRef } from "react";

const page = ({ params }: { params: { name: string } }) => {
  const videoRef = useRef(null);

  const playVideo = () => {
    // @ts-ignore
    videoRef?.current?.play();
  };

  const pauseVideo = () => {
    // @ts-ignore
    videoRef?.current?.pause();
  };
  return (
    <div className="w-4/5 mx-auto">
      <video
        ref={videoRef}
        controls
        controlsList="disablepictureinpicture"
        // style={{ width: "500px", height: "500px" }}
      >
        <source src={`//localhost:3001/video/${params.name}`} />
        <a href={`//localhost:3001/video/${params.name}`}></a>
      </video>
    </div>
  );
};

export default page;
