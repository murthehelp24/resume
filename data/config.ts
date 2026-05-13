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
    url: "https://github.com/yourusername",
    icon: FaGithub,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/yourusername/",
    icon: FaLinkedin,
  },
  {
    name: "Email",
    url: "mailto:your@email.com",
    icon: Mail,
  },
];

export const siteConfig = {
  name: "Attachai",
  title: "Full Stack Developer",
  description: "I build useful products with modern web stack",
  initials: "A",
};
