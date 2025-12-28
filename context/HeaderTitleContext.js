"use client";
import React, { createContext, useContext, useState, useMemo } from "react";

const HeaderTitleContext = createContext({ title: "Header", setTitle: () => {} });

export const HeaderTitleProvider = ({ initialTitle = "Header", children }) => {
  const [title, setTitle] = useState(initialTitle);
  const value = useMemo(() => ({ title, setTitle }), [title]);
  return (
    <HeaderTitleContext.Provider value={value}>{children}</HeaderTitleContext.Provider>
  );
};

export const useHeaderTitle = () => useContext(HeaderTitleContext);

export default HeaderTitleContext;
