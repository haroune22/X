"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/actions/register"; 

export default function SignupForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const result = await register({ email, password, username });

        if (result?.error) {
            setError(result.error);
        } else {
            setSuccess("Account created! Redirecting...");
            router.push("/sign-in");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2 border rounded  text-black"
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border rounded text-black"
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border rounded  text-black"
                required
            />
            <button type="submit" className="p-2 bg-blue-500 text-white rounded">
                Sign Up
            </button>
        </form>
    );
}
