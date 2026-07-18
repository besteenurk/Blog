export type TagPalette = {
  bg: string;
  border: string;
  text: string;
};

const PALETTE: TagPalette[] = [
  { bg: "rgba(124,155,255,0.12)", border: "rgba(124,155,255,0.35)", text: "#a6bcff" },
  { bg: "rgba(244,114,166,0.12)", border: "rgba(244,114,166,0.35)", text: "#ff9fc9" },
  { bg: "rgba(69,203,175,0.12)", border: "rgba(69,203,175,0.35)", text: "#7fe3cf" },
  { bg: "rgba(255,184,107,0.12)", border: "rgba(255,184,107,0.35)", text: "#ffcd94" },
  { bg: "rgba(168,136,255,0.12)", border: "rgba(168,136,255,0.35)", text: "#c6b3ff" },
];

export function tagColor(tag: string): TagPalette {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}
