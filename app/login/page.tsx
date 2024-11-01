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
    <section className="bg-gray-700 ">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <a
          href="#"
          className="mb-6 flex items-center text-2xl font-semibold text-gray-100"
        >
          <img
            className="mr-2 h-8 w-8 text-gray-100"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Emblem_of_Thammasat_University.svg/1024px-Emblem_of_Thammasat_University.svg.png"
            alt="logo"
          />
          TuItemFinder
        </a>
        <div className="w-full rounded-lg bg-gray-100 shadow sm:max-w-md md:mt-0 xl:p-0 dark:border">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-black text-xl font-bold leading-tight tracking-tight  md:text-2xl ">
              Sign in
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-gray-900 "
                >
                  Your username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm "
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-900 "
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg bg-red-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-violet-600 focus:outline-none focus:ring-4"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;