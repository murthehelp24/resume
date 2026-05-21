import { Mail, type LucideIcon } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import type { IconType } from "react-icons";

export interface Social {
  name: string;
  url: string;
  icon: LucideIcon | IconType;
}

export const socials: Social[] = [
  {
    name: "GitHub",
    url: "https://github.com/murthehelp24",
    icon: FaGithub,
  },
  {
    name: "Email",
    url: "mailto:attachaijumpahom@gmail.com",
    icon: Mail,
  },
];

export const siteConfig = {
  name: "Attachai Jumpahom",
  title: "Fullstack Developer",
  description:
    "Highly motivated professional transitioning from Electrical Power Technology to Software Development. I build efficient, scalable solutions as a Fullstack Developer.",
  initials: "AJ",
};
