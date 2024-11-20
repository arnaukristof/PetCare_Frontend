import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export default function AdminLoginPopup() {
  const [isOpen, setIsOpen] = useState(true); // Popup automatikusan nyitva indul
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implementálj login logikát az API hívás segítségével
    console.log({ username, password });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin Bejelentkezés</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Felhasználónév"
            className="border p-2 rounded-md"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Jelszó"
            className="border p-2 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Bejelentkezés
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
