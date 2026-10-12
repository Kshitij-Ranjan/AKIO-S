
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP, Draggable);
}

export { gsap, ScrollTrigger, Draggable, useGSAP };
