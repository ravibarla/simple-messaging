"use client";
import { useEffect, useState } from "react";
import useSwr from "swr";
// import WebSocket from "websocket-client";

export default function Home() {
  const [socket, setSocket] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8081");
    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const message = reader.result;
          console.log(`Received: ${message}`);
          setMessages((prev) => [...prev, message]);
        };
        reader.readAsText(event.data);
      } else {
        const message = event.data;
        console.log(`Received: ${message}`);
        setMessages((prev) => [...prev, message]);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    ws.onclose = (event) => {
      console.log("WebSocket closed:", event);
    };
    setSocket(ws);
    return () => {
      ws.close();
    };
  }, []);
  const handleInput = (e) => {
    if (socket && input) {
      socket.send(input);
      setInput("");
    }
  };
  return (
    <div className="flex p-8 border-2 border-slate-700">
      <div className="p-5">
        {console.log(`messages :${messages}`)}
        <h1>Message</h1>
      </div>
      <div>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
        <div className="">
          <input
            placeholder="enter the message"
            type="text"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </div>
        <button
          onClick={(e) => handleInput()}
          style={{ backgroundColor: "cyan", borderRadius: 10 }}
        >
          send
        </button>
      </div>
    </div>
  );
}
