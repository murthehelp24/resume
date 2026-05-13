import * as l from "lucide-react";
const all = Object.keys(l);
const check = ["Github", "Mail", "FileText", "ArrowUpRight", "ExternalLink", "Heart", "BookOpen", "Trophy", "Link2"];
for (const name of check) {
  const found = all.find((k) => k.toLowerCase() === name.toLowerCase());
  console.log(`${name}: ${found ?? "NOT FOUND"}`);
}
