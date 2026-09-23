"use client";

import React, { useState } from "react";
import FoodieGoLoader from "./FoodieGoLoader";

export default function AppLoader({ children }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <FoodieGoLoader onComplete={() => setLoading(false)} />}
      <div style={{ display: loading ? "none" : "block" }}>{children}</div>
    </>
  );
}