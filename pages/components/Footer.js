import React from "react";

//Hosts the top level layout of our app
const Footer = (props) => {
  return (
    <div
      className="fixed bottom-10 text-lg bg-gradient-to-r rounded-md p-1 pl-4 from-gray-200 to-white"
      style={{ margin: "20px 0 0 0" }}
    >
      Powered on Mumbai (Polygon) Network
    </div>
  );
};

export default Footer;
