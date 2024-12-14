"use client"; // Ensure this component is a Client Component

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/loginer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (username === "123" && password === "123") {
        const first_name = "รณี";
        const last_name = "ศรีนอก";
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        await fetch("/api/saveAdmin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            admin_id: username, // Adjust according to your response
            first_name: first_name, // Adjust according to your response
            last_name: last_name, // Adjust according to your response
          }),
        });
        router.push("/mainAdmin");
        setIsSubmitting(false);
      } else if (response.ok) {
        const data = await response.json();
        const [first_Name, last_Name] = data.displayname_th.split(" ");

        // Save user data to the database
        await fetch("/api/saveUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: data.username, // Adjust according to your response
            first_name: first_Name, // Adjust according to your response
            last_name: last_Name, // Adjust according to your response
          }),
        });

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        router.push("/main");
        setIsSubmitting(false);
      } else {
        alert("Invalid username or password");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Login failed");
      setIsSubmitting(false);
    }
  };

  return (
  <section className="bg-gradient-to-br from-orange-300 to-yellow-200 h-screen flex items-center justify-center">
    <div className="mx-auto w-full max-w-md px-4 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white/90 shadow-lg border border-orange-200">
        <a
          href="#"
          className="flex items-center justify-center text-2xl font-semibold text-orange-800 px-4 py-4 border-b border-orange-200 hover:bg-orange-50 transition-all"
        >
          <img
            className="mr-2 h-8 w-8"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Emblem_of_Thammasat_University.svg/1024px-Emblem_of_Thammasat_University.svg.png"
            alt="logo"
          />
          TuItemFinder
        </a>
        <div className="p-8">
          <h1 className="text-xl font-bold text-orange-800 mb-4">ลงชื่อเข้าสู่ระบบ</h1>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-orange-700"
              >
                ชื่อผู้ใช้งาน
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="w-full p-2.5 rounded-lg border border-orange-200 bg-orange-50 text-gray-900 sm:text-sm focus:ring-orange-400 focus:border-orange-400"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-orange-700"
              >
                รหัสผ่าน
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="w-full p-2.5 rounded-lg border border-orange-200 bg-orange-50 text-gray-900 sm:text-sm focus:ring-orange-400 focus:border-orange-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full mt-2 flex-grow transform rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"
              }`}
            >
                {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
  );
};

export default Login;