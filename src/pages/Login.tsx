import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify({
          isAdmin: data.isAdmin,
          userId: data.userId,
          name: data.name
        }));
        
        // Redirect based on user role
        if (data.isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Show error message from backend
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div>
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <button onClick={handleSubmit}
            type="submit"
            className="w-full py-3 text-white bg-primary hover:bg-opacity-90 rounded-md"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
