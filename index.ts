import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState<number | null>(null);

  const APPS_SCRIPT_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhC1q0xYMmuWAavsNbruxVZLJpkGSE4QobDetj01ZUCUQjoGlbAanHuVRse7r-bdotgmaEQMzhQnLTYLkaD3rgZjqYZUtxSKpfWR8dT_IJPYlGr-QLI7NDPKozUqumZD3mqLHU632ek9OGbG14scj3s8HnzV9RIb7oJhD4V42LzPF-CIwO1jvN0T7M2Xh0TEYvldaP6PAwxd6JiZBKZSvST9IO7JBuXgWD_Hlpb1o7ZSqoXklWAYcFubpgcfstL3-3-fD6iu2tUGw2ZYJzKeSyIkAPdkxUA9dzEhQCV&lib=M_vx3jfIrjADubqFYYnOqs17WtugG7ENY";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const j = await res.json();
      if (j.ok) {
        setSubmitted(true);
        setEmail("");
      } else {
        alert("Error saving email: " + (j.error || "unknown"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  useEffect(() => {
    async function fetchCount() {
      if (!APPS_SCRIPT_URL) return;
      try {
        const r = await fetch(APPS_SCRIPT_URL);
        const j = await r.json();
        setCount(j.count ?? 0);
      } catch (e) {
        console.log(e);
      }
    }
    fetchCount();
    const t = setInterval(fetchCount, 30000);
    return () => clearInterval(t);
  }, [APPS_SCRIPT_URL]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 text-center px-6">
        <motion.h1
          className="text-5xl font-extrabold mb-6 text-blue-700"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Pathwise — Your Internship Tracker
        </motion.h1>
        <motion.p
          className="max-w-2xl text-lg mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Never miss an internship deadline again. Track all your applications, get smart reminders, and stay organized with ease.
        </motion.p>
        {count !== null && (
          <p className="text-sm text-gray-500 mb-4">{`Join ${count} students already on the waitlist`}</p>
        )}

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400"
              required
            />
            <Button type="submit" className="rounded-xl px-6 py-3 bg-blue-600 text-white hover:bg-blue-700">
              Join Waitlist
            </Button>
          </form>
        ) : (
          <p className="text-green-600 font-medium text-lg">✅ Thanks! You’re on the waitlist.</p>
        )}
      </section>

      {/* Problem Section */}
      <section className="py-20 px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Why Pathwise?</h2>
          <p className="text-lg text-gray-600 mb-12">
            College students lose track of internship applications every semester. Spreadsheets get messy, deadlines slip, and opportunities are missed. Pathwise changes that.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-md rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">📅 Deadline Reminders</h3>
                <p>Auto-sync with Google Calendar so you never miss a deadline.</p>
              </CardContent>
            </Card>
            <Card className="shadow-md rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">📊 Status Dashboard</h3>
                <p>Track every application across Applied, Interview, Offer, or Rejected.</p>
              </CardContent>
            </Card>
            <Card className="shadow-md rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">✅ Simple & Organized</h3>
                <p>One clean interface to replace messy spreadsheets and sticky notes.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-8 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Early Pricing</h2>
          <p className="text-lg text-gray-600 mb-12">Join early and help shape the future of Pathwise.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-md rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Free Plan</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✔ Track up to 5 applications</li>
                  <li>✔ Manual reminders</li>
                  <li>✔ Basic dashboard</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-md rounded-2xl border-2 border-blue-500">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-blue-700">Pro — ₹200/month</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✔ Unlimited applications</li>
                  <li>✔ Google Calendar sync</li>
                  <li>✔ Priority support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center bg-white">
        <h2 className="text-3xl font-bold mb-6">Ready to simplify your internship hunt?</h2>
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-400"
              required
            />
            <Button type="submit" className="rounded-xl px-6 py-3 bg-blue-600 text-white hover:bg-blue-700">
              Join Waitlist
            </Button>
          </form>
        ) : (
          <p className="text-green-600 font-medium text-lg">✅ You’re already on the waitlist!</p>
        )}
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Pathwise. All rights reserved.
      </footer>
    </div>
  );
}
