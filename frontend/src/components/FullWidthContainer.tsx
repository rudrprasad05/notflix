import React from "react";

function FullWidthContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="w-full h-full">{children}</main>;
}

export default FullWidthContainer;
