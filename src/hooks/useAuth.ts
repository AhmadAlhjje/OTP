"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface User {
  email?: string;
  username?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      // سوف يستبدل عند الربط
      setUser({ email: "user@example.com", username: "Ahmad Obada" });
    }
    setLoading(false);
  }, []);

  return { user, loading };
}
