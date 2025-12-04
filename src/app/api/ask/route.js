// contenus de fichier api/ask/route.js
const response = await fetch("/api/ask", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Bonjour IA, test !" })
})

const data = await response.json();
console.log(data);
