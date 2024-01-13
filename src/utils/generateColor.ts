export default function generateColor(): string {
  const colors = ["red", "blue", "yellow", "green", "pink", "purple", "orange"];

  const random = Math.round(Math.random() * colors.length);
  console.log("random", random);

  return colors[random];
}
