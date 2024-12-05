"use client"; // Ensure this component is a Client Component

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/loginer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (username === "123" && password === "123") {
        const first_name = "รณพี";
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
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Login failed");
    }
  };

  return (
  <section className="bg-gray-700 h-screen flex items-center justify-center">
    <div className="mx-auto w-full max-w-md px-4 sm:px-6 lg:px-8">
      <a
        href="#"
        className="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-100"
      >
        <img
          className="mr-2 h-8 w-8"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Emblem_of_Thammasat_University.svg/1024px-Emblem_of_Thammasat_University.svg.png"
          alt="logo"
        />
        TuItemFinder
      </a>
      <div className="rounded-lg bg-gray-100 shadow-lg p-8">
        <h1 className="text-xl font-bold text-black mb-4">Sign in</h1>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="w-full p-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 sm:text-sm focus:ring-primary-600 focus:border-primary-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-400 text-white font-medium py-2.5 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  </section>
  );
};

export default Login;